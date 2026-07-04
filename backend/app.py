from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route('/profile', methods=['POST'])
def create_profile():
    data = request.get_json(silent=True) or {}
    name = str(data.get('name', '')).strip()
    bio = str(data.get('bio', '')).strip()
    image = str(data.get('image', '')).strip()

    if not name or not bio or not image:
        return jsonify({'error': 'name, bio, and image are required'}), 400

    return jsonify({'name': name, 'bio': bio, 'image': image})


@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False, use_reloader=False)
