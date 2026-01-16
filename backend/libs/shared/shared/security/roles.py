from enum import Enum


class Role(str, Enum):
    admin = "admin"
    editor = "editor"
    moderator = "moderator"
    user = "user"
