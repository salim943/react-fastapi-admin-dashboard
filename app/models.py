from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from .database import Base

class User(Base):
    __tablename__ = "users0"
    id = Column(Integer,primary_key=True,index=True)
    name = Column(String(255),index=True)
    age = Column(Integer, index=True)
    email = Column(String(255), unique=True, index=True)
    todos = relationship("Todo",back_populates="owner")
    is_active = Column(Boolean,default=False)



class Todo(Base):
    __tablename__ = "todos0"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True)
    description = Column(String(255), index=True)
    owner_id = Column(Integer, ForeignKey("users0.id"))

    owner = relationship("User",back_populates="todos")