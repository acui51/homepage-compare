from datetime import datetime, date
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from radar import entity_tuples

app = Flask(__name__)
api = Api(app)


@app.route("/radar")
def radar():
    start_date = request.args.get("from")
    end_date = request.args.get("to")
    wsj = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("the-wall-street-journal", start_date=start_date, end_date=end_date)]
    wapo = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("the-washington-post", start_date=start_date, end_date=end_date)]
    fox = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("fox-news", start_date=start_date, end_date=end_date)]

    return jsonify({"the-wall-street-journal": wsj, "the-washington-post": wapo, "fox-news": fox})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
