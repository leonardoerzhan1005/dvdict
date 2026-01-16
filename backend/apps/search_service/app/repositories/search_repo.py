from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import text


class SearchRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def search(
        self,
        query: str,
        language: str,
        category_id: Optional[int] = None,
        letter: Optional[str] = None,
        status: Optional[str] = None,
        limit: int = 20,
        offset: int = 0
    ) -> List[dict]:
        search_query = f'"{query}"* OR {query}'
        
        sql = """
            SELECT 
                fts.term_id,
                fts.language,
                fts.title,
                fts.short_definition,
                bm25(fts) as rank,
                tm.category_id,
                tm.status,
                tm.views
            FROM fts_terms fts
            JOIN term_meta tm ON fts.term_id = tm.term_id
            WHERE fts.language = :language
            AND fts MATCH :query
            AND tm.is_deleted = 0
        """
        
        params = {
            "language": language,
            "query": search_query
        }
        
        if status:
            sql += " AND tm.status = :status"
            params["status"] = status
        else:
            sql += " AND tm.status = 'approved'"
        
        if category_id:
            sql += " AND tm.category_id = :category_id"
            params["category_id"] = category_id
        
        if letter:
            sql += " AND fts.title LIKE :letter"
            params["letter"] = f"{letter}%"
        
        sql += " ORDER BY rank DESC, tm.views DESC LIMIT :limit OFFSET :offset"
        params["limit"] = limit
        params["offset"] = offset
        
        result = self.db.execute(text(sql), params)
        return [dict(row._mapping) for row in result]
    
    def autocomplete(
        self,
        query: str,
        language: str,
        limit: int = 10
    ) -> List[dict]:
        search_query = f'"{query}"*'
        
        sql = """
            SELECT 
                fts.term_id,
                fts.title,
                fts.slug
            FROM fts_terms fts
            JOIN term_meta tm ON fts.term_id = tm.term_id
            WHERE fts.language = :language
            AND fts.title MATCH :query
            AND tm.is_deleted = 0
            AND tm.status = 'approved'
            ORDER BY tm.views DESC
            LIMIT :limit
        """
        
        result = self.db.execute(
            text(sql),
            {"language": language, "query": search_query, "limit": limit}
        )
        return [dict(row._mapping) for row in result]
    
    def index_term(
        self,
        term_id: int,
        language: str,
        title: str,
        definition: str,
        short_definition: Optional[str],
        examples: Optional[str],
        synonyms: Optional[str],
        tags_text: Optional[str]
    ) -> None:
        # FTS5 не поддерживает UPSERT, поэтому сначала удаляем, потом вставляем
        delete_sql = """
            DELETE FROM fts_terms 
            WHERE term_id = :term_id AND language = :language
        """
        self.db.execute(text(delete_sql), {"term_id": term_id, "language": language})
        
        insert_sql = """
            INSERT INTO fts_terms (term_id, language, title, definition, short_definition, examples, synonyms, tags_text)
            VALUES (:term_id, :language, :title, :definition, :short_definition, :examples, :synonyms, :tags_text)
        """
        
        self.db.execute(
            text(insert_sql),
            {
                "term_id": term_id,
                "language": language,
                "title": title,
                "definition": definition,
                "short_definition": short_definition or "",
                "examples": examples or "",
                "synonyms": synonyms or "",
                "tags_text": tags_text or ""
            }
        )
        self.db.commit()
    
    def delete_term(self, term_id: int) -> None:
        self.db.execute(text("DELETE FROM fts_terms WHERE term_id = :term_id"), {"term_id": term_id})
        self.db.execute(text("DELETE FROM term_meta WHERE term_id = :term_id"), {"term_id": term_id})
        self.db.commit()
    
    def update_term_meta(
        self,
        term_id: int,
        status: str,
        category_id: int,
        is_deleted: bool,
        views: int,
        created_at: str
    ) -> None:
        sql = """
            INSERT INTO term_meta (term_id, status, category_id, is_deleted, views, created_at)
            VALUES (:term_id, :status, :category_id, :is_deleted, :views, :created_at)
            ON CONFLICT(term_id) DO UPDATE SET
                status = excluded.status,
                category_id = excluded.category_id,
                is_deleted = excluded.is_deleted,
                views = excluded.views
        """
        
        self.db.execute(
            text(sql),
            {
                "term_id": term_id,
                "status": status,
                "category_id": category_id,
                "is_deleted": 1 if is_deleted else 0,
                "views": views,
                "created_at": created_at
            }
        )
        self.db.commit()
