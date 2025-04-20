from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class FullText(db.Model):
    """Represents lines from the text"""
    __tablename__ = 'full_text'
    
    line_number = db.Column(db.Integer, primary_key=True)
    line_text = db.Column(db.Text)
    speaker = db.Column(db.String(100))

    def __repr__(self):
        return f'<Line {self.line_number}: {self.speaker}>'

class LemmaData(db.Model):
    """Dictionary lemma data"""
    __tablename__ = 'lemma_data'
    
    lemma_id = db.Column(db.Integer, primary_key=True)
    lemma = db.Column(db.String(100))
    form = db.Column(db.String(100))
    line_number = db.Column(db.Integer)
    postag = db.Column(db.String(10))
    normalized = db.Column(db.String(100))
    norm_form = db.Column(db.String(100))
    full_eng = db.Column(db.String(200))
    eng_lemma = db.Column(db.String(100))
    form_eng = db.Column(db.String(100))
    norm_form_eng = db.Column(db.String(100))

    definitions = db.relationship('LemmaDefinition', backref='lemma', lazy=True)

    def __repr__(self):
        return f'<Lemma {self.lemma_id}: {self.lemma}>'

class LemmaDefinition(db.Model):
    """Word definitions"""
    __tablename__ = 'lemma_definitions'
    
    id = db.Column(db.Integer, primary_key=True)
    lemma_id = db.Column(db.Integer, db.ForeignKey('lemma_data.lemma_id'))
    def_num = db.Column(db.Integer)
    short_definition = db.Column(db.Text)
    queries = db.Column(db.Text)

    def __repr__(self):
        return f'<Definition {self.def_num} for Lemma {self.lemma_id}>'