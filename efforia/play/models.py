from django.db.models import ForeignKey,TextField,CharField,DateTimeField,Model
from django.contrib.auth.models import User
from datetime import date
import sys,os
path = os.path.abspath("efforia")
sys.path.append(path)

class Playable(Model):
    name = CharField(default='',max_length=50)
    user = ForeignKey(User,related_name='+')
    description = TextField()
    token = CharField(max_length=20)
    date = DateTimeField(default=date.today(),auto_now_add=True)
    
class Schedule(Model):
    name = CharField(default='',max_length=50)
    user = ForeignKey(User,related_name='+')
    play = ForeignKey(Playable,related_name='+')
    date = DateTimeField(default=date.today(),auto_now_add=True)

class ScheduleBinding(Model):
    play = ForeignKey(Schedule,related_name='+')
    bind = ForeignKey(Schedule,related_name='+')
    date = DateTimeField(default=date.today(),auto_now_add=True)
    