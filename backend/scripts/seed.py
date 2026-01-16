import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from apps.auth_service.app.db.session import SessionLocal as AuthSession, init_db as init_auth_db
from apps.auth_service.app.repositories.user_repo import UserRepository
from apps.auth_service.app.core.security import get_password_hash
from apps.dictionary_service.app.db.session import SessionLocal as DictSession, init_db as init_dict_db
from apps.dictionary_service.app.repositories.category_repo import CategoryRepository
from apps.dictionary_service.app.repositories.term_repo import TermRepository
from apps.dictionary_service.app.db.models.term import TermStatus
from libs.shared.shared.security.roles import Role


def seed_auth():
    init_auth_db()
    db = AuthSession()
    
    user_repo = UserRepository(db)
    
    admin = user_repo.get_by_email("admin@example.com")
    if not admin:
        admin = user_repo.create(
            name="Admin",
            email="admin@example.com",
            password_hash=get_password_hash("admin123"),
            role=Role.admin.value
        )
        print("✓ Created admin user: admin@example.com / admin123")
    else:
        print("✓ Admin user already exists: admin@example.com")
        admin = admin
    
    db.close()
    return admin.id if hasattr(admin, 'id') else admin


def seed_dictionary(admin_id: int):
    init_dict_db()
    db = DictSession()
    
    category_repo = CategoryRepository(db)
    term_repo = TermRepository(db)
    
    # Создаем категорию "Технические термины" на 3 языках
    category = category_repo.get_by_slug("technical")
    if not category:
        category = category_repo.create("technical", None)
        category_repo.add_translation(category.id, "ru", "Технические термины", "Техническая терминология")
        category_repo.add_translation(category.id, "en", "Technical Terms", "Technical terminology")
        category_repo.add_translation(category.id, "kz", "Техникалық терминдер", "Техникалық терминология")
        print("✓ Created category 'Technical' with translations (ru, en, kz)")
    else:
        print("✓ Category 'Technical' already exists")
    
    # Создаем первый термин "Цифровизация" / "Digitalization" / "Цифрландыру"
    term1 = term_repo.get_by_slug("digitalization")
    if not term1:
        term1 = term_repo.create(
            slug="digitalization",
            category_id=category.id,
            author_id=admin_id,
            status=TermStatus.approved
        )
        # Русский
        term_repo.add_translation(
            term1.id, "ru",
            title="Цифровизация",
            definition="Процесс перевода информации в цифровой формат или использование цифровых технологий для преобразования бизнес-процессов и операций с целью повышения эффективности.",
            short_definition="Перевод информации в цифровой формат",
            examples="Цифровизация государственных услуг значительно упростила процесс получения документов.",
            synonyms="цифровая трансформация, автоматизация",
            antonyms="аналоговый формат"
        )
        # Английский
        term_repo.add_translation(
            term1.id, "en",
            title="Digitalization",
            definition="The process of converting information into digital format or using digital technologies to transform business processes and operations for improved efficiency.",
            short_definition="Converting information into digital format",
            examples="Digitalization of government services has significantly simplified the process of obtaining documents.",
            synonyms="digital transformation, automation",
            antonyms="analog format"
        )
        # Казахский
        term_repo.add_translation(
            term1.id, "kz",
            title="Цифрландыру",
            definition="Ақпаратты сандық форматқа ауыстыру немесе тиімділікті арттыру үшін бизнес-процестер мен операцияларды түрлендіру үшін сандық технологияларды пайдалану процесі.",
            short_definition="Ақпаратты сандық форматқа ауыстыру",
            examples="Мемлекеттік қызметтерді цифрландыру құжаттарды алу процесін айтарлықтай жеңілдетті.",
            synonyms="сандық трансформация, автоматтандыру",
            antonyms="аналогтық формат"
        )
        term_repo.update(term1, views=1250)
        print("✓ Created term 'Digitalization' with translations (ru, en, kz)")
    else:
        print("✓ Term 'Digitalization' already exists")
    
    # Создаем второй термин "Инфраструктура" / "Infrastructure" / "Инфрақұрылым"
    term2 = term_repo.get_by_slug("infrastructure")
    if not term2:
        term2 = term_repo.create(
            slug="infrastructure",
            category_id=category.id,
            author_id=admin_id,
            status=TermStatus.approved
        )
        # Русский
        term_repo.add_translation(
            term2.id, "ru",
            title="Инфраструктура",
            definition="Базовые физические и организационные структуры и объекты, необходимые для функционирования общества или предприятия, включая транспорт, связь и коммунальные услуги.",
            short_definition="Базовые структуры для функционирования общества",
            examples="Развитие транспортной инфраструктуры способствует экономическому росту региона.",
            synonyms="основные фонды, коммуникации",
            antonyms="отсутствие инфраструктуры"
        )
        # Английский
        term_repo.add_translation(
            term2.id, "en",
            title="Infrastructure",
            definition="The basic physical and organizational structures and facilities needed for the operation of a society or enterprise, including transportation, communication, and utilities.",
            short_definition="Basic structures for society operation",
            examples="Development of transport infrastructure contributes to the economic growth of the region.",
            synonyms="basic facilities, communications",
            antonyms="lack of infrastructure"
        )
        # Казахский
        term_repo.add_translation(
            term2.id, "kz",
            title="Инфрақұрылым",
            definition="Қоғам немесе кәсіпорынның жұмыс істеуіне қажетті негізгі физикалық және ұйымдастырушылық құрылымдар мен объектілер, соның ішінде көлік, байланыс және коммуналдық қызметтер.",
            short_definition="Қоғамның жұмыс істеуіне арналған негізгі құрылымдар",
            examples="Көлік инфрақұрылымын дамыту аймақтың экономикалық өсуіне ықпал етеді.",
            synonyms="негізгі объектілер, байланыс",
            antonyms="инфрақұрылымның жоқтығы"
        )
        term_repo.update(term2, views=980)
        print("✓ Created term 'Infrastructure' with translations (ru, en, kz)")
    else:
        print("✓ Term 'Infrastructure' already exists")
    
    db.close()


if __name__ == "__main__":
    print("=" * 60)
    print("Seeding database...")
    print("=" * 60)
    
    admin_id = seed_auth()
    seed_dictionary(admin_id)
    
    print("=" * 60)
    print("✓ Done! Database seeded successfully.")
    print("=" * 60)
    print("\nCreated:")
    print("  - Admin user: admin@example.com / admin123")
    print("  - Category: Technical (ru, en, kz)")
    print("  - Term 1: Digitalization (ru, en, kz)")
    print("  - Term 2: Infrastructure (ru, en, kz)")
    print("=" * 60)
