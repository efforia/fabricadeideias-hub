from django.db.models import ForeignKey,TextField,CharField,IntegerField,DateTimeField,BooleanField,Model
from django.contrib.auth.models import User
from datetime import date
import sys,os
path = os.path.abspath("efforia")
sys.path.append(path)

class Playable(Model):
    name = CharField(default='',max_length=150)
    user = ForeignKey(User,related_name='+')
    category = IntegerField(default=1)
    description = TextField()
    token = CharField(max_length=20)
    credit = IntegerField(default=0)
    visual = CharField(default='',max_length=40)
    date = DateTimeField(default=date.today(),auto_now_add=True)
    def token(self): return self.name[:1]
    def name_trimmed(self): return self.name.split(';')[0][1:]
    def month(self): return self.date.month-1
    
class Schedule(Model):
    name = CharField(default='',max_length=50)
    user = ForeignKey(User,related_name='+')
    play = ForeignKey(Playable,related_name='+')
    date = DateTimeField(default=date.today(),auto_now_add=True)
    def token(self): return self.name[:2]
    def name_trimmed(self): return self.name.split(';')[0][1:]
    def month(self): return self.date.month-1
    
class PlayablePurchased(Model):
    name = CharField(default='$>',max_length=10)
    owner = ForeignKey(User,related_name='owner')
    video = ForeignKey(Playable,related_name='video')
    date = DateTimeField(auto_now_add=True)
    def token(self): return self.name[:2]
    def name_trimmed(self): return self.name.split(';')[0][1:]
    def month(self): return self.date.month-1

class PlayableFan(Model):
    fan = ForeignKey(Playable,related_name='+')
    user = ForeignKey(User,related_name='+')
    date = DateTimeField(auto_now_add=True)
    def token(self): return self.name[:2]
    def name_trimmed(self): return self.name.split(';')[0][1:]
    def month(self): return self.date.month-1