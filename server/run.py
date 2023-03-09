from datetime import datetime, date
from flask import Flask, jsonify, request
from flask_restful import Resource, Api
from radar import entity_tuples
from frequency import interpret_source, generate_standard
from radar import headlines_by_source

app = Flask(__name__)
api = Api(app)


@app.route("/radar")
def radar():
    start_date = request.args.get("from")
    end_date = request.args.get("to")
    standard_counter = generate_standard(["wsj", "the-washington-post", "fox-news"], start_date=start_date, end_date=end_date)

    wsj = interpret_source("wsj", standard_counter)
    wp = interpret_source("the-washington-post", standard_counter)
    fox = interpret_source("fox-news", standard_counter)
    return jsonify({"wsj": wsj, "the-washington-post": wp, "fox-news": fox})


if __name__ == "__main__":
    app.run(port=8000, debug=True)