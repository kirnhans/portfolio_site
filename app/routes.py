from flask import Flask, render_template

app = Flask(__name__, template_folder=’’)

def index(standard_num, standard_text):
    return render_template('standard_template.html',
    	standard_num=standard_num,
    	standard_text=standard_text)

if __name__ == ‘__main__’:
 app.run(debug=True)