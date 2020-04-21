var Place=Class.create({
    initialize: function(option){
        this.util=new Util();
        this.place=document.body;//игровое поле
        this.place.style.backgroundColor='#a1a95e';
        this.screen=this.util.getPageSize();
        this.listAllObj=new Array();//список всех объектов
        this.curObj=null;
        this.oknoInstr=new OknoInstr(this);
    }
})

var OknoInstr=Class.create({
    initialize: function(owner){
        var thisEl=this;
        this.owner=owner;
        this.listImg=["dom1.png","dom2.png","dom3.png","dom4.png","dor1.png","dor2.png","dor3.png","dorP2.png","tree1m.png"];
        this.listClass=[{name:"StopObj"},{name:"NonStopObj"},{name:"Tank"}];
        this.curEl=null;
        this.windEl=new Object();
        this.fS=function(){return function(ev){thisEl.objSel(ev);}};
        this.fM=function(){return function(ev){thisEl.objM(ev);}};
        this.uM=function(){return function(ev){thisEl.objUM(ev);}};
        this.fMC=function(o){return function(ev){thisEl.objUMC(ev,o);}};
        this.docCl=function(){return function(){
            if(thisEl.curEl!=null){
                thisEl.curEl.el.style.border="0 none";
                thisEl.curEl=null;
                thisEl.unselected();
                document.onmousedown=null;
            }
        }};
        this.getContent();
    },
    unselected:function(){
        this.windEl.eltBC.update();
    },
    selected:function(){
        if(this.curEl==null) return;
        var thisEl=this;
        var obj=this.curEl;
        var w=this.windEl.eltBC;
        w.update();
        var cBCl=new Element('select');
        for(var i=0;i<this.listClass.length;i++){
            if(i==0 && thisEl.curEl.classd==null){
                thisEl.curEl.classd=this.listClass[i].name;
            }
            var t=new Element('option',{value:this.listClass[i].name}).insert(this.listClass[i].name);
            if(this.listClass[i].name==thisEl.curEl.classd) t.selected=true;
            cBCl.insert(t);
        }
        cBCl.onchange=function(){thisEl.curEl.classd = cBCl.value;}
        w.insert(new Element('br'));
        w.insert(cBCl);
        w.insert(new Element('br'));
        this.curEl.elX=new Element('input',{type:'text',size:'10'});
        this.curEl.elX.onchange=function(){thisEl.curEl.x=thisEl.curEl.elX.value;thisEl.curEl.el.style.left=thisEl.curEl.elX.value+"px"};
        this.curEl.elX.value=thisEl.curEl.x;
        this.curEl.elY=new Element('input',{type:'text',size:'10'});
        this.curEl.elY.onchange=function(){thisEl.curEl.y=thisEl.curEl.elY.value;thisEl.curEl.el.style.top=thisEl.curEl.elY.value+"px"};
        this.curEl.elY.value=thisEl.curEl.y;
        w.insert(new Element('div').insert("X: ").insert(this.curEl.elX).insert('px'));
        w.insert(new Element('div').insert("Y: ").insert(this.curEl.elY).insert('px'));
    },
    objSel:function(ev){
        document.onmousemove=null;
        document.onmouseup=function(){};
        if(this.curEl!=null){
            this.curEl.el.style.border="0 none";
            this.curEl=null;
        }
        var el=new Element('img',{style:'position:absolute;left:0;top:0;z-index:1001;'})
        el.src=ev.target.src;
        this.owner.place.insert(el);
        this.curEl=new Object();

        el.style.left=ev.clientX+"px";
        el.style.top=ev.clientY+"px";
        el.style.border="1px solid red";
        this.curEl.el=el;
        this.selected();
        ev.target.ondragstart=function(){return false;};
        document.onmousemove=this.fM();
        document.onmouseup=this.uM();

        //ev.target.onMouseUp()
    },
    objM:function(ev){
        this.curEl.el.style.left=ev.clientX+"px";
        this.curEl.el.style.top=ev.clientY+"px";
        this.curEl.x = ev.clientX+Math.round(ev.clientWidth/2);
        this.curEl.y= ev.clientY+Math.round(ev.clientHeight/2);
        try{this.curEl.elX.value = ev.clientX;
            this.curEl.elY.value = ev.clientY;}catch(e){}
    },
    objUM:function(ev){
        this.curEl.el.style.left=ev.clientX+"px";
        this.curEl.el.style.top=ev.clientY+"px";

        this.curEl.x=ev.clientX+Math.round(ev.target.clientWidth/2);
        this.curEl.y=ev.clientY+Math.round(ev.target.clientHeight/2);


        this.owner.listAllObj[this.owner.listAllObj.length]=this.curEl;
        document.onmousemove=null;
        //document.onmousedown=this.docCl();
        this.curEl.el.onmousedown=this.fMC(this.curEl);

        document.onmouseup=null;
    },
    objUMC:function(ev,o){
        if(this.curEl!=null){
            this.curEl.el.style.border="0 none";
            this.curEl=null;
        }
        o.el.style.border="1px solid red";

        o.el.ondragstart=function(){return false;};
        this.curEl=o;
        this.selected();
        document.onmousemove=this.fM();
        document.onmouseup=this.uM();
    },
    drawPole:function(obj){
        for(var i=0;i<obj.length;i++){
            var el=new Element('img',{style:'position:absolute;left:0;top:0;z-index:1001;',src:obj[i].src});
            var o=new Object();
            o.classd = obj[i].classO;
            o.el=el;
            this.owner.listAllObj[this.owner.listAllObj.length]=o;
            el.onmousedown=this.fMC(o);
            this.owner.place.insert(el);
            el.style.left=(new Number(obj[i].l)-Math.round(el.clientWidth/2))+'px';
            el.style.top=(new Number(obj[i].t)-Math.round(el.clientHeight/2))+'px';
            o.x=new Number(obj[i].l);
            o.y=new Number(obj[i].t);
        }
    },
    getContent:function(){
        var thisEl=this;
        var opt=new Object();
            opt.width=300;
            opt.height=700;
            opt.zIndex=1002;
            var v=new Wind(thisEl.owner.place, "Инструменты",opt);

            v.show();


        var wind=new Element('div');



        var butLC=new Element('input',{type:'button',value:'Загрузить поле'});
        butLC.onclick=function(){
            var jss='[{"classO":"StopObj","l":"395","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"463","t":"41","src":"images/tree1m.png"},{"classO":"StopObj","l":"407","t":"212","src":"images/tree1m.png"},{"classO":"StopObj","l":"466","t":"212","src":"images/tree1m.png"},{"classO":"StopObj","l":"529","t":"217","src":"images/tree1m.png"},{"classO":"StopObj","l":"523","t":"43","src":"images/tree1m.png"},{"classO":"StopObj","l":"585","t":"40","src":"images/tree1m.png"},{"classO":"StopObj","l":"590","t":"215","src":"images/tree1m.png"},{"classO":"StopObj","l":"652","t":"218","src":"images/tree1m.png"},{"classO":"StopObj","l":"646","t":"41","src":"images/tree1m.png"},{"classO":"StopObj","l":"709","t":"221","src":"images/tree1m.png"},{"classO":"StopObj","l":"713","t":"283","src":"images/tree1m.png"},{"classO":"StopObj","l":"711","t":"344","src":"images/tree1m.png"},{"classO":"StopObj","l":"708","t":"402","src":"images/tree1m.png"},{"classO":"StopObj","l":"703","t":"463","src":"images/tree1m.png"},{"classO":"StopObj","l":"706","t":"520","src":"images/tree1m.png"},{"classO":"StopObj","l":"705","t":"44","src":"images/tree1m.png"},{"classO":"StopObj","l":"766","t":"46","src":"images/tree1m.png"},{"classO":"StopObj","l":"395","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"463","t":"41","src":"images/tree1m.png"},{"classO":"StopObj","l":"523","t":"43","src":"images/tree1m.png"},{"classO":"StopObj","l":"585","t":"40","src":"images/tree1m.png"},{"classO":"StopObj","l":"646","t":"41","src":"images/tree1m.png"},{"classO":"StopObj","l":"705","t":"44","src":"images/tree1m.png"},{"classO":"StopObj","l":"766","t":"46","src":"images/tree1m.png"},{"classO":"StopObj","l":"825","t":"46","src":"images/tree1m.png"},{"classO":"StopObj","l":"891","t":"46","src":"images/tree1m.png"},{"classO":"StopObj","l":"899","t":"284","src":"images/tree1m.png"},{"classO":"StopObj","l":"901","t":"231","src":"images/tree1m.png"},{"classO":"StopObj","l":"899","t":"284","src":"images/tree1m.png"},{"classO":"StopObj","l":"970","t":"232","src":"images/tree1m.png"},{"classO":"StopObj","l":"954","t":"46","src":"images/tree1m.png"},{"classO":"StopObj","l":"899","t":"344","src":"images/tree1m.png"},{"classO":"StopObj","l":"515","t":"331","src":"images/dom1.png"},{"classO":"StopObj","l":"600","t":"364","src":"images/dom2.png"},{"classO":"StopObj","l":"901","t":"411","src":"images/tree1m.png"},{"classO":"StopObj","l":"898","t":"476","src":"images/tree1m.png"},{"classO":"StopObj","l":"706","t":"520","src":"images/tree1m.png"},{"classO":"StopObj","l":"895","t":"532","src":"images/tree1m.png"},{"classO":"StopObj","l":"898","t":"476","src":"images/tree1m.png"},{"classO":"StopObj","l":"901","t":"411","src":"images/tree1m.png"},{"classO":"StopObj","l":"899","t":"344","src":"images/tree1m.png"},{"classO":"StopObj","l":"899","t":"284","src":"images/tree1m.png"},{"classO":"StopObj","l":"1098","t":"348","src":"images/dom1.png"},{"classO":"StopObj","l":"260","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"319","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"379","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"438","t":"839","src":"images/tree1m.png"},{"classO":"StopObj","l":"495","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"556","t":"838","src":"images/tree1m.png"},{"classO":"StopObj","l":"616","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"674","t":"841","src":"images/tree1m.png"},{"classO":"StopObj","l":"729","t":"841","src":"images/tree1m.png"},{"classO":"StopObj","l":"790","t":"842","src":"images/tree1m.png"},{"classO":"StopObj","l":"851","t":"838","src":"images/tree1m.png"},{"classO":"StopObj","l":"907","t":"841","src":"images/tree1m.png"},{"classO":"StopObj","l":"959","t":"842","src":"images/tree1m.png"},{"classO":"StopObj","l":"1016","t":"838","src":"images/tree1m.png"},{"classO":"StopObj","l":"1071","t":"844","src":"images/tree1m.png"},{"classO":"StopObj","l":"1130","t":"841","src":"images/tree1m.png"},{"classO":"StopObj","l":"1184","t":"843","src":"images/tree1m.png"},{"classO":"StopObj","l":"1243","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1358","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1301","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1358","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1243","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1243","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1301","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1414","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"202","t":"835","src":"images/tree1m.png"},{"classO":"StopObj","l":"144","t":"835","src":"images/tree1m.png"},{"classO":"StopObj","l":"88","t":"833","src":"images/tree1m.png"},{"classO":"StopObj","l":"34","t":"833","src":"images/tree1m.png"},{"classO":"StopObj","l":"88","t":"833","src":"images/tree1m.png"},{"classO":"StopObj","l":"144","t":"835","src":"images/tree1m.png"},{"classO":"StopObj","l":"202","t":"835","src":"images/tree1m.png"},{"classO":"StopObj","l":"260","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"319","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"379","t":"837","src":"images/tree1m.png"},{"classO":"StopObj","l":"438","t":"839","src":"images/tree1m.png"},{"classO":"StopObj","l":"495","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"556","t":"838","src":"images/tree1m.png"},{"classO":"StopObj","l":"34","t":"772","src":"images/tree1m.png"},{"classO":"StopObj","l":"34","t":"711","src":"images/tree1m.png"},{"classO":"StopObj","l":"39","t":"649","src":"images/tree1m.png"},{"classO":"StopObj","l":"35","t":"595","src":"images/tree1m.png"},{"classO":"StopObj","l":"35","t":"595","src":"images/tree1m.png"},{"classO":"StopObj","l":"34","t":"538","src":"images/tree1m.png"},{"classO":"StopObj","l":"35","t":"480","src":"images/tree1m.png"},{"classO":"StopObj","l":"38","t":"419","src":"images/tree1m.png"},{"classO":"StopObj","l":"37","t":"368","src":"images/tree1m.png"},{"classO":"StopObj","l":"30","t":"32","src":"images/tree1m.png"},{"classO":"StopObj","l":"90","t":"32","src":"images/tree1m.png"},{"classO":"StopObj","l":"152","t":"32","src":"images/tree1m.png"},{"classO":"StopObj","l":"210","t":"30","src":"images/tree1m.png"},{"classO":"StopObj","l":"270","t":"32","src":"images/tree1m.png"},{"classO":"StopObj","l":"330","t":"34","src":"images/tree1m.png"},{"classO":"StopObj","l":"395","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"33","t":"87","src":"images/tree1m.png"},{"classO":"StopObj","l":"36","t":"145","src":"images/tree1m.png"},{"classO":"StopObj","l":"35","t":"202","src":"images/tree1m.png"},{"classO":"StopObj","l":"1021","t":"40","src":"images/tree1m.png"},{"classO":"StopObj","l":"1081","t":"38","src":"images/tree1m.png"},{"classO":"StopObj","l":"1141","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1201","t":"34","src":"images/tree1m.png"},{"classO":"StopObj","l":"1263","t":"38","src":"images/tree1m.png"},{"classO":"StopObj","l":"1326","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1388","t":"39","src":"images/tree1m.png"},{"classO":"StopObj","l":"1445","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1503","t":"35","src":"images/tree1m.png"},{"classO":"StopObj","l":"1562","t":"33","src":"images/tree1m.png"},{"classO":"StopObj","l":"1625","t":"34","src":"images/tree1m.png"},{"classO":"StopObj","l":"1687","t":"34","src":"images/tree1m.png"},{"classO":"StopObj","l":"1746","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1803","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1861","t":"36","src":"images/tree1m.png"},{"classO":"StopObj","l":"1865","t":"91","src":"images/tree1m.png"},{"classO":"StopObj","l":"1866","t":"146","src":"images/tree1m.png"},{"classO":"StopObj","l":"1866","t":"202","src":"images/tree1m.png"},{"classO":"StopObj","l":"1868","t":"259","src":"images/tree1m.png"},{"classO":"StopObj","l":"1869","t":"316","src":"images/tree1m.png"},{"classO":"StopObj","l":"1869","t":"374","src":"images/tree1m.png"},{"classO":"StopObj","l":"1871","t":"432","src":"images/tree1m.png"},{"classO":"StopObj","l":"1473","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"1532","t":"846","src":"images/tree1m.png"},{"classO":"StopObj","l":"1593","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"1653","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1710","t":"845","src":"images/tree1m.png"},{"classO":"StopObj","l":"1769","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"1825","t":"840","src":"images/tree1m.png"},{"classO":"StopObj","l":"1878","t":"839","src":"images/tree1m.png"},{"classO":"StopObj","l":"1874","t":"778","src":"images/tree1m.png"},{"classO":"StopObj","l":"1868","t":"717","src":"images/tree1m.png"},{"classO":"StopObj","l":"1864","t":"655","src":"images/tree1m.png"},{"classO":"StopObj","l":"1867","t":"590","src":"images/tree1m.png"},{"classO":"StopObj","l":"1807","t":"591","src":"images/tree1m.png"},{"classO":"StopObj","l":"1748","t":"585","src":"images/tree1m.png"},{"classO":"StopObj","l":"1685","t":"591","src":"images/tree1m.png"},{"classO":"StopObj","l":"1631","t":"593","src":"images/tree1m.png"},{"classO":"StopObj","l":"1572","t":"591","src":"images/tree1m.png"},{"classO":"StopObj","l":"1573","t":"649","src":"images/tree1m.png"},{"classO":"StopObj","l":"1576","t":"706","src":"images/tree1m.png"},{"classO":"StopObj","l":"1098","t":"348","src":"images/dom1.png"},{"classO":"StopObj","l":"531","t":"365","src":"images/tree1m.png"},{"classO":"StopObj","l":"1115","t":"386","src":"images/tree1m.png"},{"classO":"StopObj","l":"1170","t":"387","src":"images/tree1m.png"},{"classO":"StopObj","l":"1809","t":"432","src":"images/tree1m.png"},{"classO":"StopObj","l":"1753","t":"430","src":"images/tree1m.png"},{"classO":"StopObj","l":"1699","t":"380","src":"images/tree1m.png"},{"classO":"StopObj","l":"1655","t":"332","src":"images/tree1m.png"},{"classO":"StopObj","l":"36","t":"257","src":"images/tree1m.png"},{"classO":"StopObj","l":"35","t":"312","src":"images/tree1m.png"}]';
            var objL=jss.evalJSON();
            thisEl.drawPole(objL);
        }
        wind.insert(new Element('div').insert(butLC));

        var windeltP=new Element('div')
        var eltP=new Element('div',{style:"background:#999;border-bottom:1px outset #777;"}).insert("Объекты");
        windeltP.insert(eltP);
        this.windEl.eltB=new Element('div',{style:"height:300px;border:1px inset #888;overflow:auto;"});

        for(var i=0;i<this.listImg.length;i++){
            var el=new Element('img',{width:'70px'});
            el.src="images/"+this.listImg[i];
            this.windEl.eltB.insert(el);
            el.onmousedown=this.fS();
        }

        windeltP.insert(this.windEl.eltB);
        wind.insert(windeltP);

        var windeltPC=new Element('div')
        var eltPC=new Element('div',{style:"background:#999;border-bottom:1px outset #777;"}).insert("Свойства");
        windeltPC.insert(eltPC);
        this.windEl.eltBC=new Element('div',{style:"height:300px;border:1px inset #888;overflow:auto;"}).insert("&nbsp");
        windeltPC.insert(this.windEl.eltBC);

        var butGC=new Element('input',{type:'button',value:'Получить код'});
        butGC.onclick=function(){
            var c='[';
            for(var i=0;i<thisEl.owner.listAllObj.length;i++){
                if(i!=0) c+=',';
                c+='{"classO":"';
                c+=thisEl.owner.listAllObj[i].classd+'",';
                var src=thisEl.owner.listAllObj[i].el.src;
                src='images'+src.substring(src.lastIndexOf('/'),src.length);
                c+='"l":"'+thisEl.owner.listAllObj[i].x+'","t":"'+thisEl.owner.listAllObj[i].y+'","src":"'+src+'"';
                c+='}';
            }
            c+=']';
            var opt=new Object();
            opt.width=300;
            opt.height=300;
            opt.zIndex=1002;
            var v=new Wind(thisEl.owner.place, "Код",opt);

            v.show();
            v.setContent(new Element('div',{style:'overflow:auto;'}).insert(c));
        }

        wind.insert(windeltPC);
        wind.insert(butGC);
        v.setContent(new Element('div',{style:'overflow:auto;'}).insert(wind));

    }
})

var Util=Class.create({
    initialize: function(){
    },
    getPageSize:function(parent){
        parent = parent || document.body;
        var windowWidth, windowHeight;
        var pageHeight, pageWidth;
        if (parent != document.body) {
            windowWidth = parent.getWidth();
            windowHeight = parent.getHeight();
            pageWidth = parent.scrollWidth;
            pageHeight = parent.scrollHeight;
        }
        else {
            var xScroll, yScroll;
            if (window.innerHeight && window.scrollMaxY) {
                xScroll = document.body.scrollWidth;
                yScroll = window.innerHeight + window.scrollMaxY;
            } else if (document.body.scrollHeight > document.body.offsetHeight){ // all but Explorer Mac
                xScroll = document.body.scrollWidth;
                yScroll = document.body.scrollHeight;
            } else { // Explorer Mac...would also work in Explorer 6 Strict, Mozilla and Safari
                xScroll = document.body.offsetWidth;
                yScroll = document.body.offsetHeight;
            }
            if (self.innerHeight) { // all except Explorer
                windowWidth = self.innerWidth;
                windowHeight = self.innerHeight;
            } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
                windowWidth = document.documentElement.clientWidth;
                windowHeight = document.documentElement.clientHeight;
            } else if (document.body) { // other Explorers
                windowWidth = document.body.clientWidth;
                windowHeight = document.body.clientHeight;
            }
            // for small pages with total height less then height of the viewport
            if(yScroll < windowHeight){
                pageHeight = windowHeight;
            } else {
                pageHeight = yScroll;
            }
            // for small pages with total width less then width of the viewport
            if(xScroll < windowWidth){
                pageWidth = windowWidth;
            } else {
                pageWidth = xScroll;
            }
        }
        return {pageWidth: pageWidth ,pageHeight: pageHeight , windowWidth: windowWidth, windowHeight: windowHeight};
    },
//content - место в какую оболочку вставить , l -расстояние слева, t- расстояние сверху, el- текст который или контент нужно вставить, timeHide- время через которое удалить  в милисек(0 - не удалять никогда)
    printEl:function(content,l,t,el,timeHide){
        var df=new Element('div',{style:"font-size:xx-large;position:absolute;left:"+l+"px;top:"+t+"px;z-index:3"}).insert(el);
        content.insert(df);
        var tr=function(ddd){setTimeout(function(){ddd.remove();},timeHide);};
        tr(df);
    }
});

function constructorStart(){
    new Place();
}


var Wind=Class.create({
    initialize: function(owner,title,option){
        this.owner=owner;
        this.title=title;
        if(option){
            this.w=(option.width)?option.width:100;
            this.h=(option.height)?option.height:100;
            this.zind=(option.zIndex)?option.zIndex:0;
        }
        this._getContent();
    },
    _getContent:function(){
        var thisEl=this;
        var blockBut=new Element('span',{style:'',align:'right'});
        var butCl=new Element('input',{type:'button',value:'Close'});
        blockBut.insert(butCl);
        butCl.onclick=function(){thisEl.hide();};
        this.wind=new Element('div',{style:'position:absolute;left:0;top:0;z-index:'+this.zind+';display:block; width:'+this.w+'px;height:'+this.h+'px;background:#bbb; border:3px ridge #888'});
        this.windTitle=new Element('span').insert(this.title);
        var windH=new Element('div',{style:"background:#999;border-bottom:1px outset #777;"}).insert(this.windTitle).insert(new Element('div',{style:'',align:'right'}).insert(blockBut));
        this.windCont=new Element('div',{style:'border:1px inset #888;background:#fff;'});
        this.windStat=new Element('div',{style:'background:#999;border-bottom:1px outset #777;'}).insert('&nbsp;');
        this.wind.insert(windH).insert(this.windCont).insert(this.windStat);
        this.owner.insert(this.wind);
        this.windCont.style.height=this.h-windH.clientHeight-this.windStat.clientHeight-5+'px';
        this.hide();
    },
    getContent:function(){return this.windCont;},
    setContent:function(el){
        el.style.height=this.windCont.clientHeight+'px';
        this.windCont.update(el);
    },
    setTitle:function(title){this.windTitle.update(title);},
    hide:function(){
        this.wind.hide();
    },
    show:function(){
        this.wind.show();
    }
})



//window.captureEvents(Event.MOUSEDOWN | Event.MOUSEUP);
//
//window.onmousedown= startDrag;
//window.onmouseup= endDrag;
//window.onmousemove= moveIt;
//
//function startDrag(e) {
//    window.captureEvents(Event.MOUSEMOVE);
//}
//function moveIt(e) { // показывать координаты
//    status= "x: " + e.pageX + " y: " + e.pageY;
//}
//function endDrag(e) {
//    window.releaseEvents(Event.MOUSEMOVE);
//}