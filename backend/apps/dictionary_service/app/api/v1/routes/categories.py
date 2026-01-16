from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.dictionary_service.app.services.category_service import CategoryService
from apps.dictionary_service.app.schemas.category import (
    CategoryCreateRequest,
    CategoryUpdateRequest,
    CategoryOut
)
from libs.shared.shared.dto.language import Lang

router = APIRouter(prefix="/categories", tags=["categories"])


@router.get("", response_model=list[CategoryOut])
async def get_categories(
    lang: Lang = Query(default=Lang.ru),
    db: Session = Depends(get_db)
):
    service = CategoryService(db)
    categories = service.category_repo.get_all()
    result = []
    for cat in categories:
        try:
            result.append(service.get_category(cat.id, lang))
        except Exception as e:
            import traceback
            print(f"Error getting category {cat.id}: {e}")
            traceback.print_exc()
    return result


@router.get("/{category_id}", response_model=CategoryOut)
async def get_category(
    category_id: int,
    lang: Lang = Query(default=Lang.ru),
    db: Session = Depends(get_db)
):
    service = CategoryService(db)
    return service.get_category(category_id, lang)


@router.post("", response_model=CategoryOut, status_code=201)
async def create_category(
    data: CategoryCreateRequest,
    db: Session = Depends(get_db)
):
    service = CategoryService(db)
    return service.create_category(data)


@router.put("/{category_id}", response_model=CategoryOut)
async def update_category(
    category_id: int,
    data: CategoryUpdateRequest,
    lang: Lang = Query(default=Lang.ru),
    db: Session = Depends(get_db)
):
    service = CategoryService(db)
    return service.update_category(category_id, data, lang)


@router.delete("/{category_id}", status_code=204)
async def delete_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    service = CategoryService(db)
    category = service.category_repo.get_by_id(category_id)
    if not category:
        from libs.shared.shared.errors.exceptions import NotFoundError
        raise NotFoundError("Category", str(category_id))
    service.category_repo.delete(category)
