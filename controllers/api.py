# functions used by the web application


@auth.requires_signature()
def add_track():
    track_id = db.track.insert(
        track_title=request.vars.track_title,
        track_content=request.vars.track_content,
        track_is_fav = "no",
    )
    return response.json(dict(track_id=track_id))


@auth.requires_login()
def delete_track():
    track_id = request.vars.track_id
    db(db.track.id == track_id).delete()
    return "WE DELETED."


@auth.requires_login()
def get_track_content():
    rows = db(db.track).select()
    pid = int(request.vars.track_id)
    for row in rows:
        if row.id == pid:
            track_content = row.track_content
    return response.json(dict(track_content=track_content))


@auth.requires_login()
def get_track_list():
    results = []
    rows = db(db.track).select(orderby=~db.track.track_time)
    for row in rows:
        if row.track_author == auth.user.email:
            if row.track_content == None:
                content = ""
            else:
                content = "content"
            tracks_to_send = dict(
                id=int(row.id),
                track_title=row.track_title,
                track_content=content,
                track_author=row.track_author,
                track_is_fav=row.track_is_fav,
            )
            results.append(tracks_to_send)

    return response.json(dict(track_list=results))


def set_favorites():
    track_id = int(request.vars.track_id)
    print(request.vars.fav)
    db.track.update_or_insert(
        (db.track.id == track_id),
        track_is_fav = request.vars.fav
    )
    return "ok"

@auth.requires_login()
@auth.requires_signature()
def edit_track():
    rows = db(db.track).select()
    pid = int(request.vars.id)
    title = request.vars.track_title

    for row in rows:
        if row.id == pid:
            # TODO: make sure we can update multiple values this way
            row.update_record(track_content=request.vars.content, track_title=title)
    return "ok!"


    

def upload_track():
    track_content = request.vars.track_content
    track_id = int(request.vars.track_id)
    
    db.track.update_or_insert(
        (db.track.id == track_id),
        track_content = track_content
    )
    return "ok"

def get_user_email_for_frontend():
    if (auth.user.email == None):
        email = ""
    else:
        email = auth.user.email
    return response.json(dict(email=email))
