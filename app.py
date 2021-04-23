# from: https://medium.com/swlh/baking-static-sites-with-python-and-jinja-330fe29bbe08
import os, shutil
from jinja2 import Template, Environment, FileSystemLoader


standards_dict = { 1: "Know students and how they learn",
2: "Know the content and how to teach it",
3: "Plan for and implement effective teaching and learning",
4: "Create and maintain supportive and safe learning environments",
5: "Assess, provide feedback and report on student learning",
6: "Engage in professional learning",
7: "Engage professionally with colleagues, parents/carers and the community",
}

class SiteGenerator(object):
    def __init__(self):
        self.feeds = []
        self.env = Environment(loader=FileSystemLoader('template'))
        self.empty_public()
        self.copy_static()
        self.render_page()

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
            shutil.copytree('template/static', 'public/static')
        except:
            print("Error copying static files.")

    def render_page(self):
        print("Rendering page to static file.")
        template = self.env.get_template('standard_template.html')
        for (num, text) in standards_dict:
            with open(f"public/standard{{num}}.html", 'w+') as file:
                html = template.render(standard_num=num, standard_text=text)
                file.write(html)


if __name__ == "__main__":
    SiteGenerator()