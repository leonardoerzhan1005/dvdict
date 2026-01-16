from enum import Enum


class SortOrder(str, Enum):
    asc = "asc"
    desc = "desc"


class TermSort(str, Enum):
    newest = "newest"
    oldest = "oldest"
    popularity = "popularity"
    alphabetical = "alphabetical"
