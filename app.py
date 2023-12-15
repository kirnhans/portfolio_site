# from: https://medium.com/swlh/baking-static-sites-with-python-and-jinja-330fe29bbe08
import os, shutil
from jinja2 import Template, Environment, FileSystemLoader
from markdown import markdown


standards_dict = { 1: ("Know students and how they learn","templates/static/written_content/standard1.md"),
2: ("Know the content and how to teach it", "templates/static/written_content/standard2.md"),
3: ("Plan for and implement effective teaching and learning", "templates/static/written_content/standard3.md"),
4: ("Create and maintain supportive and safe learning environments", "templates/static/written_content/standard4.md"),
5: ("Assess, provide feedback and report on student learning", "templates/static/written_content/standard5.md"),
6: ("Engage in professional learning", "templates/static/written_content/standard6.md"),
7: ("Engage professionally with colleagues, parents/carers and the community", "templates/static/written_content/standard7.md"),
}

class SiteGenerator(object):
    def __init__(self):
        self.env = Environment(loader=FileSystemLoader('templates'))
        self.empty_public()
        self.copy_static()
        self.render_standards_page()
        self.render_intro_page()
        self.render_dev_page()
        self.render_bookmarks_page()

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

    def get_text_from_file(self, filepath, placeholder = ""):
        file_text = "Bad filepath: " + filepath # placeholder
        if (placeholder):
            file_text = placeholder
        if os.path.exists(filepath):
            print(filepath)
            file_text = open(filepath, "r").read()
        return file_text

    def render_standards_page(self):
        print("Rendering standards pages to static file.")
        template = self.env.get_template('standard_template.html')
        for num in standards_dict:
            (head, essay_path) = standards_dict[num]
            essay_text = self.get_text_from_file(essay_path,
                "This is an idea waiting to be explored in my journey as a teacher.")
            with open(os.path.join("public", f"standard{num}.html"), 'w+') as file:
                html = template.render(standard_num=num, standard_head=head,
                    standard_essay=markdown(essay_text))
                file.write(html)

    def render_intro_page(self):
        print("Rendering intro page to static file.")
        template = self.env.get_template('intro_template.html')
        intro_text = self.get_text_from_file(
            "templates/static/written_content/intro.md", "Hi! I'm Kirn.")

        my_resources_text = self.get_text_from_file(
            "templates/static/written_content/my_resources.md")
        my_resources_text_html = markdown(my_resources_text)
        my_resources_text_html = my_resources_text_html.replace("<p>", "")
        my_resources_text_html = my_resources_text_html.replace("</p>", "")
        
        with open(os.path.join("public", "index.html"), 'w+') as file:
            html = template.render(intro_content=markdown(intro_text),
                standards_dict=standards_dict,
                my_resources=my_resources_text_html)
            file.write(html)

    def render_bookmarks_page(self):
        print("Rendering bookmarks page to static file.")
        template = self.env.get_template('bookmarks_template.html')
        bookmarks_text = self.get_text_from_file(
            "templates/static/written_content/bookmarks.md")
        with open(os.path.join("public", "bookmarks.html"), 'w+') as file:
            html = template.render(bookmarks_content=markdown(bookmarks_text))
            file.write(html)

    def render_dev_page(self):
        print("Rendering dev page to static file.")
        template = self.env.get_template('developer_template.html')
        with open(os.path.join("public", "developer.html"), 'w+') as file:
            html = template.render()
            file.write(html)


if __name__ == "__main__":
    SiteGenerator()