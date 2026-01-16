from typing import Optional, List
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.models.category import Category
from apps.dictionary_service.app.db.models.category_translation import CategoryTranslation


class CategoryRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def create(self, slug: str, parent_id: Optional[int] = None) -> Category:
        category = Category(slug=slug, parent_id=parent_id)
        self.db.add(category)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def get_by_id(self, category_id: int) -> Optional[Category]:
        return self.db.query(Category).filter(Category.id == category_id).first()
    
    def get_by_slug(self, slug: str) -> Optional[Category]:
        return self.db.query(Category).filter(Category.slug == slug).first()
    
    def get_all(self) -> List[Category]:
        return self.db.query(Category).all()
    
    def get_children(self, parent_id: int) -> List[Category]:
        return self.db.query(Category).filter(Category.parent_id == parent_id).all()
    
    def update(self, category: Category, **kwargs) -> Category:
        for key, value in kwargs.items():
            if hasattr(category, key):
                setattr(category, key, value)
        self.db.commit()
        self.db.refresh(category)
        return category
    
    def delete(self, category: Category) -> None:
        self.db.delete(category)
        self.db.commit()
    
    def add_translation(self, category_id: int, language: str, title: str, description: Optional[str] = None) -> CategoryTranslation:
        translation = CategoryTranslation(
            category_id=category_id,
            language=language,
            title=title,
            description=description
        )
        self.db.add(translation)
        self.db.commit()
        self.db.refresh(translation)
        return translation
    
    def get_translation(self, category_id: int, language: str) -> Optional[CategoryTranslation]:
        return self.db.query(CategoryTranslation).filter(
            CategoryTranslation.category_id == category_id,
            CategoryTranslation.language == language
        ).first()
    
    def update_translation(self, translation: CategoryTranslation, **kwargs) -> CategoryTranslation:
        for key, value in kwargs.items():
            if hasattr(translation, key):
                setattr(translation, key, value)
        self.db.commit()
        self.db.refresh(translation)
        return translation
