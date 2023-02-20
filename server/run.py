from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from radar import entity_tuples

app = Flask(__name__)
api = Api(app)


@app.route("/radar")
def radar():
    wsj = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("the-wall-street-journal")]
    wapo = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("the-washington-post")]
    fox = [{"name": entity, "prominence": proportion} for entity, proportion in entity_tuples("fox-news")]

    return jsonify({"the-wall-street-journal": wsj, "the-washington-post": wapo, "fox-news": fox})


if __name__ == "__main__":
    app.run(port=8000, debug=True)
