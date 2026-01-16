from typing import Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from apps.dictionary_service.app.db.session import get_db
from apps.dictionary_service.app.services.term_service import TermService
from apps.dictionary_service.app.schemas.term import (
    TermCreateRequest,
    TermUpdateRequest,
    TermOut,
    TermOutFull
)
from apps.dictionary_service.app.api.v1.deps import get_current_user_id, get_current_user_role
from libs.shared.shared.dto.language import Lang
from libs.shared.shared.dto.pagination import PageParams
from apps.dictionary_service.app.db.models.term import TermStatus

router = APIRouter(prefix="/terms", tags=["terms"])


@router.get("", response_model=list[TermOut])
async def get_terms(
    lang: Lang = Query(default=Lang.ru),
    category_id: Optional[int] = Query(default=None),
    letter: Optional[str] = Query(default=None),
    status: Optional[str] = Query(default=None),
    page: int = Query(default=1, ge=1),
    size: int = Query(default=20, ge=1, le=100),
    db: Session = Depends(get_db)
):
    service = TermService(db)
    term_status = TermStatus(status) if status else None
    offset = (page - 1) * size
    
    terms = service.term_repo.get_all(
        category_id=category_id,
        status=term_status,
        language=lang.value if letter else None,
        letter=letter,
        limit=size,
        offset=offset
    )
    
    print(f"DEBUG: Found {len(terms)} terms in repo")
    
    result = []
    for term in terms:
        try:
            term_out = service.get_term(term.id, lang)
            result.append(term_out)
        except Exception as e:
            import traceback
            print(f"Error getting term {term.id}: {e}")
            traceback.print_exc()
    return result


@router.get("/{term_id}", response_model=TermOut)
async def get_term(
    term_id: int,
    lang: Lang = Query(default=Lang.ru),
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    service = TermService(db)
    if user_id is None:
        service.term_repo.increment_views(term_id)
    return service.get_term(term_id, lang)


@router.post("", response_model=TermOut, status_code=201)
async def create_term(
    data: TermCreateRequest,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id),
    user_role: Optional[str] = Depends(get_current_user_role)
):
    if not user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    # Если пользователь админ/редактор/модератор - автоматически одобряем термин
    from libs.shared.shared.security.roles import Role
    from apps.dictionary_service.app.db.models.term import TermStatus
    from apps.dictionary_service.app.core.rbac import check_role
    
    initial_status = TermStatus.approved if user_role and check_role(user_role, [Role.admin, Role.editor, Role.moderator]) else TermStatus.draft
    
    service = TermService(db)
    return service.create_term(data, user_id, initial_status)


@router.put("/{term_id}", response_model=TermOut)
async def update_term(
    term_id: int,
    data: TermUpdateRequest,
    lang: Lang = Query(default=Lang.ru),
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = TermService(db)
    return service.update_term(term_id, data, lang)


@router.delete("/{term_id}", status_code=204)
async def delete_term(
    term_id: int,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = TermService(db)
    term = service.term_repo.get_by_id(term_id)
    if not term:
        from libs.shared.shared.errors.exceptions import NotFoundError
        raise NotFoundError("Term", str(term_id))
    service.term_repo.soft_delete(term)


@router.post("/{term_id}/submit", response_model=TermOut)
async def submit_term(
    term_id: int,
    db: Session = Depends(get_db),
    user_id: Optional[int] = Depends(get_current_user_id)
):
    if not user_id:
        from fastapi import HTTPException, status
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
    
    service = TermService(db)
    return service.submit_term(term_id)
