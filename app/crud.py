from sqlalchemy.orm import Session

from . import models,schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def get_users(db: Session, skip:int=0, limit:int=100):
    # return db.query(models.User).offset(skip).limit(limit).all()
    return db.query(models.User).offset(skip).limit(limit).all()


def create_user(db: Session, user:schemas.UserCreate):
    db_user = models.User(email=user.email,
                          name=user.name, age=user.age,)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User.name).offset(skip).limit(limit).all()
    
    
def get_todos(db: Session, skip:int=0, limit: int=100):
    return db.query(models.Todo).offset(skip).limit(limit).all()


def create_user_todo(db:Session, todo:schemas.TodoCreate, user_id : int):
    db_todo = models.Todo(**todo.model_dump(),owner_id=user_id )
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

def get_user_todo_by_title(db: Session, user_id: int, title: str):
    return db.query(models.Todo).filter(models.Todo.owner_id == user_id, models.Todo.title == title).first()


def get_all_users_with_todos(db: Session):
    users = db.query(models.User).all()
    return [
        schemas.UserWithTodos(
            user=schemas.UserOut(
                id=user.id,
                name=user.name,
                email=user.email,
                age=user.age
            ),
            todos=[
                schemas.TodoOut(
                    id=todo.id,
                    title=todo.title,
                    description=todo.description
                )
                for todo in user.todos
            ]
        )
        for user in users
    ]

