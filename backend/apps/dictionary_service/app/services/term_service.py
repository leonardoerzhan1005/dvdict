from typing import Optional
from sqlalchemy.orm import Session
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.dictionary_service.app.repositories.tag_repo import TagRepository
from apps.dictionary_service.app.repositories.revision_repo import RevisionRepository
from apps.dictionary_service.app.db.models.term import Term, TermStatus
from apps.dictionary_service.app.schemas.term import (
    TermCreateRequest,
    TermUpdateRequest,
    TermOut,
    TermOutFull
)
from libs.shared.shared.errors.exceptions import NotFoundError, ConflictError
from libs.shared.shared.dto.language import Lang
import json


class TermService:
    def __init__(self, db: Session):
        self.term_repo = TermRepository(db)
        self.tag_repo = TagRepository(db)
        self.revision_repo = RevisionRepository(db)
        self.db = db
    
    def create_term(self, data: TermCreateRequest, author_id: int, initial_status: Optional[TermStatus] = None) -> TermOut:
        existing = self.term_repo.get_by_slug(data.slug)
        if existing:
            raise ConflictError(f"Term with slug '{data.slug}' already exists")
        
        status = initial_status if initial_status else TermStatus.draft
        term = self.term_repo.create(data.slug, data.category_id, author_id, status)
        
        for trans in data.translations:
            self.term_repo.add_translation(
                term.id,
                trans.language.value,
                trans.title,
                trans.definition,
                trans.short_definition,
                trans.examples,
                trans.synonyms,
                trans.antonyms
            )
        
        for tag_slug in data.tag_slugs:
            tag = self.tag_repo.get_or_create(tag_slug)
            term.tags.append(tag)
        
        self.db.commit()
        
        return self.get_term(term.id, data.translations[0].language)
    
    def get_term(self, term_id: int, lang: Lang) -> TermOut:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        translation = self.term_repo.get_translation(term_id, lang.value)
        if not translation:
            for fallback_lang in [Lang.ru, Lang.en, Lang.kz]:
                translation = self.term_repo.get_translation(term_id, fallback_lang.value)
                if translation:
                    break
        
        if not translation:
            from apps.dictionary_service.app.schemas.tag import TagOut
            return TermOut(
                id=term.id,
                slug=term.slug,
                category_id=term.category_id,
                status=term.status.value,
                views=term.views,
                created_at=term.created_at.isoformat(),
                updated_at=term.updated_at.isoformat(),
                language=lang,
                title="",
                definition="",
                short_definition=None,
                examples=None,
                synonyms=None,
                antonyms=None,
                tags=[TagOut(id=tag.id, slug=tag.slug) for tag in term.tags]
            )
        
        from apps.dictionary_service.app.schemas.tag import TagOut
        
        return TermOut(
            id=term.id,
            slug=term.slug,
            category_id=term.category_id,
            status=term.status.value,
            views=term.views,
            created_at=term.created_at.isoformat(),
            updated_at=term.updated_at.isoformat(),
            language=Lang(translation.language),
            title=translation.title,
            definition=translation.definition,
            short_definition=translation.short_definition,
            examples=translation.examples,
            synonyms=translation.synonyms,
            antonyms=translation.antonyms,
            tags=[TagOut(id=tag.id, slug=tag.slug) for tag in term.tags]
        )
    
    def update_term(self, term_id: int, data: TermUpdateRequest, lang: Lang) -> TermOut:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        old_data = {
            "slug": term.slug,
            "category_id": term.category_id,
            "status": term.status.value
        }
        
        update_data = {}
        if data.slug:
            existing = self.term_repo.get_by_slug(data.slug)
            if existing and existing.id != term_id:
                raise ConflictError(f"Term with slug '{data.slug}' already exists")
            update_data["slug"] = data.slug
        
        if data.category_id is not None:
            update_data["category_id"] = data.category_id
        
        if update_data:
            self.term_repo.update(term, **update_data)
            self.revision_repo.create(term_id, term.author_id, old_data)
        
        if data.translations:
            for trans in data.translations:
                existing_trans = self.term_repo.get_translation(term_id, trans.language.value)
                if existing_trans:
                    self.term_repo.update_translation(
                        existing_trans,
                        title=trans.title,
                        definition=trans.definition,
                        short_definition=trans.short_definition,
                        examples=trans.examples,
                        synonyms=trans.synonyms,
                        antonyms=trans.antonyms
                    )
                else:
                    self.term_repo.add_translation(
                        term_id,
                        trans.language.value,
                        trans.title,
                        trans.definition,
                        trans.short_definition,
                        trans.examples,
                        trans.synonyms,
                        trans.antonyms
                    )
        
        if data.tag_slugs is not None:
            term.tags.clear()
            for tag_slug in data.tag_slugs:
                tag = self.tag_repo.get_or_create(tag_slug)
                term.tags.append(tag)
            self.db.commit()
        
        return self.get_term(term_id, lang)
    
    def submit_term(self, term_id: int) -> TermOut:
        term = self.term_repo.get_by_id(term_id)
        if not term:
            raise NotFoundError("Term", str(term_id))
        
        if term.status != TermStatus.draft:
            raise ConflictError("Only draft terms can be submitted")
        
        self.term_repo.update(term, status=TermStatus.pending)
        return self.get_term(term_id, Lang.ru)
