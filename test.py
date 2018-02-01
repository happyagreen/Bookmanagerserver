#coding:utf-8
import urllib
import sys
import json
import MySQLdb
img_url = 'https://img3.doubanio.com\/lpic\/s4578461.jpg'
save_path = 'F:/image/'+sys.argv[1]+'.jpg'



htmltext = urllib.urlopen('https://api.douban.com/v2/book/isbn/'+sys.argv[1]).read()
jsons = json.loads(htmltext)
hjson = json.dumps(jsons,sort_keys=True,ensure_ascii=False)
jsonss = eval(hjson)


f = urllib.urlopen(jsonss['images']['large'].replace("\\","/"))
with open(save_path, "wb") as code:
    code.write(f.read())
db = MySQLdb.connect("localhost","root","z1x2c3v4b5","ebook" )
cursor = db.cursor()
sql = "INSERT INTO bookinformation VALUES(null,%s , %s, %s, %s)"
try:
   # 执行sql语句
   #cursor.execute(sql,(jsonss['title'],'F:/image/'+sys.argv[1]+'.jpg',sys.argv[1],jsons))
   s = jsons['title']
   #print chardet.detect(htmltext)
   cursor.execute(sql,('','F:/image/'+sys.argv[1]+'.jpg',sys.argv[1],''))
   # 提交到数据库执行
   db.commit()
except MySQLdb.Error , e:
    try:
        sqlError =  "Error %d:%s" % (e.args[0], e.args[1])
        db.rollback()
    except IndexError:
        print "MySQL Error:%s" % str(e)
print hjson.encode('utf-8')
   # Rollback in case there is any error
