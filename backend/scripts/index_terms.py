import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.dictionary_service.app.db.session import SessionLocal as DictSession, init_db as init_dict_db
from apps.search_service.app.db.session import SessionLocal as SearchSession, init_db as init_search_db
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.search_service.app.services.indexing_service import IndexingService

def index_all_terms():
    init_dict_db()
    init_search_db()
    
    dict_db = DictSession()
    search_db = SearchSession()
    
    term_repo = TermRepository(dict_db)
    indexing_service = IndexingService(search_db)
    
    terms = term_repo.get_all(limit=1000, offset=0)
    print(f"Found {len(terms)} terms to index")
    
    indexed = 0
    for term in terms:
        if term.is_deleted:
            continue
            
        # Получаем все переводы термина
        translations = []
        for lang in ['ru', 'en', 'kz']:
            trans = term_repo.get_translation(term.id, lang)
            if trans:
                translations.append(trans)
        
        for trans in translations:
            try:
                indexing_service.index_term(
                    term_id=term.id,
                    language=trans.language,
                    title=trans.title,
                    definition=trans.definition,
                    short_definition=trans.short_definition,
                    examples=trans.examples,
                    synonyms=trans.synonyms,
                    tags_text="",
                    status=term.status.value,
                    category_id=term.category_id,
                    is_deleted=term.is_deleted,
                    views=term.views,
                    created_at=term.created_at.isoformat() if term.created_at else ""
                )
                indexed += 1
            except Exception as e:
                print(f"Error indexing term {term.id} ({trans.language}): {e}")
    
    print(f"✓ Indexed {indexed} term translations")
    
    dict_db.close()
    search_db.close()

if __name__ == "__main__":
    print("=" * 60)
    print("Indexing terms in FTS5...")
    print("=" * 60)
    index_all_terms()
    print("=" * 60)
    print("✓ Done!")
    print("=" * 60)
