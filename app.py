# from: https://medium.com/swlh/baking-static-sites-with-python-and-jinja-330fe29bbe08
import os, shutil
from jinja2 import Template, Environment, FileSystemLoader
from markdown import markdown


standards_dict = { 1: ("Know students and how they learn", "templates/static/standard1.txt"),
2: ("Know the content and how to teach it", "templates/static/standard2.txt"),
3: ("Plan for and implement effective teaching and learning", "templates/static/standard3.txt"),
4: ("Create and maintain supportive and safe learning environments", "templates/static/standard4.txt"),
5: ("Assess, provide feedback and report on student learning", "templates/static/standard5.txt"),
6: ("Engage in professional learning", "templates/static/standard6.txt"),
7: ("Engage professionally with colleagues, parents/carers and the community", "templates/static/standard7.txt"),
}

class SiteGenerator(object):
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader('templates'))
        self.empty_public()
        self.copy_static()
        self.render_standards_page()
        self.render_intro_page()

    def empty_public(self):
        """ Ensure the public directory is empty before generating. """
        try:
            shutil.rmtree('./public') 
            os.mkdir('./public')
        except:
            print("Error cleaning up old files.")

    def copy_static(self):
        """ Copy static assets to the public directory """
        try:
            shutil.copytree('templates/static', 'public/static')
        except:
            print("Error copying static files.")

    def render_standards_page(self):
        print("Rendering standards pages to static file.")
        template = self.env.get_template('standard_template.html')
        for num in standards_dict:
            (head, essay_path) = standards_dict[num]
            essay_text = "This is an idea waiting to be explored in my journey as a teacher."
            if os.path.exists(essay_path):
                essay_text = open(essay_path, "r").read()
            with open(os.path.join("public", f"standard{num}.html"), 'w+') as file:
                html = template.render(standard_num=num, standard_head=head,
                    standard_essay=markdown(essay_text))
                file.write(html)

    def render_intro_page(self):
        print("Rendering intro pages to static file.")
        template = self.env.get_template('intro_template.html')
        with open(os.path.join("public", "index.html"), 'w+') as file:
            html = template.render()
            file.write(html)

if __name__ == "__main__":
    SiteGenerator()