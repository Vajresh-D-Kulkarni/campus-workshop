def student_entity(db_item) -> dict:
    return {
        "id": db_item.get("_id"),
        "name": db_item.get("name"),
        "roll_no": db_item.get("roll_no"),
        "branch": db_item.get("branch"),
        "year": db_item.get("year"),
        "email": db_item.get("email")
    }

def student_list_entity(db_items) -> list:
    return [student_entity(item) for item in db_items]
