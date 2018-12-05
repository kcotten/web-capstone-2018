# functions used by the web application


@auth.requires_signature()
def add_track():
    track_id = db.track.insert(
        track_title=request.vars.track_title,
        track_content=request.vars.track_content,
    )
    return response.json(dict(track_id=track_id))


@auth.requires_signature()
def get_track_content():
    # maybe move fetching tracks to a seperate function due to lag concerns
    rows = db(db.track).select()
    pid = int(request.vars.id)
    for row in rows:
        if row.id == pid:
            track_to_send = dict(
                track_title = row.track_title,
                track_content = row.track_content,
                track_author = row.track_author,
            )

    return response.json(dict(track=track_to_send))


@auth.requires_signature()
def get_track_list():
    results = []
    rows = db(db.track).select(orderby=~db.track.track_time)
    for row in rows:
        tracks_to_send = dict(
            id=int(row.id),
            track_title=row.track_title,
            track_content=row.track_content,
            track_author=row.track_author,
        )
        results.append(tracks_to_send)

    return response.json(dict(track_list=results))
