# Generated by Django 5.0.1 on 2024-02-18 19:37

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='foodId',
            field=models.CharField(max_length=200, null=True),
        ),
    ]
