from typing import Optional
from sqlalchemy.orm import Session
from apps.dictionary_service.app.repositories.category_repo import CategoryRepository
from apps.dictionary_service.app.schemas.category import (
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryOut
)
from libs.shared.shared.errors.exceptions import NotFoundError, ConflictError
from libs.shared.shared.dto.language import Lang


class CategoryService:
    def __init__(self, db: Session):
        self.category_repo = CategoryRepository(db)
        self.db = db
    
    def create_category(self, data: CategoryCreateRequest) -> CategoryOut:
        existing = self.category_repo.get_by_slug(data.slug)
        if existing:
            raise ConflictError(f"Category with slug '{data.slug}' already exists")
        
        if data.parent_id:
            parent = self.category_repo.get_by_id(data.parent_id)
            if not parent:
                raise NotFoundError("Category", str(data.parent_id))
        
        category = self.category_repo.create(data.slug, data.parent_id)
        
        for trans in data.translations:
            self.category_repo.add_translation(
                category.id,
                trans.language.value,
                trans.title,
                trans.description
            )
        
        return self.get_category(category.id, data.translations[0].language)
    
    def get_category(self, category_id: int, lang: Lang) -> CategoryOut:
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise NotFoundError("Category", str(category_id))
        
        translation = self.category_repo.get_translation(category_id, lang.value)
        if not translation:
            for fallback_lang in [Lang.ru, Lang.en, Lang.kz]:
                translation = self.category_repo.get_translation(category_id, fallback_lang.value)
                if translation:
                    break
        
        if not translation:
            return CategoryOut(
                id=category.id,
                slug=category.slug,
                parent_id=category.parent_id,
                title="",
                description=None
            )
        
        return CategoryOut(
            id=category.id,
            slug=category.slug,
            parent_id=category.parent_id,
            title=translation.title,
            description=translation.description
        )
    
    def update_category(self, category_id: int, data: CategoryUpdateRequest, lang: Lang) -> CategoryOut:
        category = self.category_repo.get_by_id(category_id)
        if not category:
            raise NotFoundError("Category", str(category_id))
        
        update_data = {}
        if data.slug:
            existing = self.category_repo.get_by_slug(data.slug)
            if existing and existing.id != category_id:
                raise ConflictError(f"Category with slug '{data.slug}' already exists")
            update_data["slug"] = data.slug
        
        if data.parent_id is not None:
            if data.parent_id:
                parent = self.category_repo.get_by_id(data.parent_id)
                if not parent:
                    raise NotFoundError("Category", str(data.parent_id))
            update_data["parent_id"] = data.parent_id
        
        if update_data:
            self.category_repo.update(category, **update_data)
        
        if data.translations:
            for trans in data.translations:
                existing_trans = self.category_repo.get_translation(category_id, trans.language.value)
                if existing_trans:
                    self.category_repo.update_translation(
                        existing_trans,
                        title=trans.title,
                        description=trans.description
                    )
                else:
                    self.category_repo.add_translation(
                        category_id,
                        trans.language.value,
                        trans.title,
                        trans.description
                    )
        
        return self.get_category(category_id, lang)
