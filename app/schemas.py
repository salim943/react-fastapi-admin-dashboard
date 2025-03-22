from pydantic import BaseModel
from typing import List, Optional

class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None  # Optional, defaults to None


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: int
    owner_id: int

    class Config:
        orm_mode = True

###########################################################################
class UserBase(BaseModel):
    email: str
    age: int  # Age is required here, it will not accept None
    name: str


class UserCreate(UserBase):
    pass  # Inherits directly from UserBase, no changes needed for creation


class User(UserBase):
    id: int
    is_active: bool
    todos: List[Todo] = []  # List of todos related to the user

    class Config:
        orm_mode = True  # This enables the ORM to work with Pydantic models


# NOTE: This is just like serializer.py in Django, with the same structure
