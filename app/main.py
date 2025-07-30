from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRouter
from . import crud, models, schemas
from .database import SessionLocal, engine
import numpy as np

#for admin page
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from datetime import datetime, timedelta

from fastapi import status
from pydantic import BaseModel
from typing import List
import uuid
# Initialize FastAPI app
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create tables
models.Base.metadata.create_all(bind=engine)

def get_current_user_role():
    return "admin"  # Replace with actual role logic
    
# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Insert initial data into the todos table, avoiding duplicates
def insert_initial_todos(db: Session):
    # Example user to associate the todos with (ensure a user exists)
    user = crud.get_user_by_email(db, email="user_x6@gmail.com")
    if not user:
        # Create a new user if one does not exist
        user = crud.create_user(db, schemas.UserCreate(email="user_x6@gmail.com", name="Evan", age=30))

    # Default todos to add
    default_todos = [
        schemas.TodoCreate(title="Diabetes", description="Regular Checkup")
    ]

    # Insert each todo if it doesn't already exist
    for todo in default_todos:
        existing_todo = crud.get_user_todo_by_title(db=db, user_id=user.id, title=todo.title)
        if not existing_todo:
            crud.create_user_todo(db=db, user_id=user.id, todo=todo)

# Ensure initial data is loaded on startup
with SessionLocal() as db:
    insert_initial_todos(db)
    

# Token and authentication setup
SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "password123"
}

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_admin(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username != ADMIN_CREDENTIALS["username"]:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

@app.post("/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_CREDENTIALS["username"] or form_data.password != ADMIN_CREDENTIALS["password"]:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

# Admin-protected route to insert user details and todos
@app.post("/admin/insert_user_with_todos")
def admin_insert_user_with_todos(
    payload: dict,
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin),
):
    # Extract user data from the payload
    user_data = payload.get("user")
    todos_data = payload.get("todos")

    if not user_data:
        return {"status": "error", "message": "User data is required."}

    if not todos_data or not isinstance(todos_data, list):
        return {"status": "error", "message": "A list of todos is required."}

    # Create or fetch the user
    user = crud.get_user_by_email(db, email=user_data["email"])
    if not user:
        user = crud.create_user(
            db,
            schemas.UserCreate(
                email=user_data["email"], name=user_data["name"], age=user_data["age"]
            ),
        )

    # Insert todos for the user
    inserted_todos = []
    for todo_data in todos_data:
        existing_todo = crud.get_user_todo_by_title(
            db=db, user_id=user.id, title=todo_data["title"]
        )
        if not existing_todo:
            new_todo = crud.create_user_todo(
                db, user_id=user.id, todo=schemas.TodoCreate(**todo_data)
            )
            inserted_todos.append(new_todo)

    return {
        "status": "success",
        "message": f"User '{user.name}' and {len(inserted_todos)} todos inserted successfully.",
    }


@app.get("/admin/users_with_todos", response_model=List[schemas.UserWithTodos])
def get_users_with_todos(
    db: Session = Depends(get_db),
    current_admin: str = Depends(get_current_admin)
):
    return crud.get_all_users_with_todos(db)

# Define the router
router = APIRouter()

    
# Include the router
app.include_router(router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
