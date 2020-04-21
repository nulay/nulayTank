//Класс проверяющий столкновение 2 объектов
var Collides=Class.create({
    initialize: function(){
    },
//функция проверки пересечения 2 прямоугольников obj1 должен содержать центр точку(obj.l,obj.t), угол поворота(obj.a), ширину и высоту(obj.w,obj.h)
    hitTest:function(obj1,obj2){
        if(obj1==null | obj2==null) return false;
        if(obj1==obj2) return false;
        if(!this.rHitTest(obj1,obj2)) return false; //если проверка не проходит значит предметы предметы не столкнутся
        // return true;
        var p1= this.getPO(obj1);
        var r1=this.rotObj(obj1, p1);
        var p2= this.getPO(obj2);
        var r2=this.rotObj(obj2, p2);
        for(var i=0;i<4;i++){
            for(var y=0;y<4;y++){
                var z1=i+1; if(z1==4) z1=0;
                var z2=y+1; if(z2==4) z2=0;
                if(this.isLinePartsIntersected(r1[i],r1[z1],r2[y],r2[z2])) return true;
            }
        }
        if(this._ptoQuad(obj2.l,obj2.t,r1[0].x,r1[0].y,r1[1].x,r1[1].y,r1[2].x,r1[2].y,r1[3].x,r1[3].y)) return true;
        return this._ptoQuad(obj1.l,obj1.t,r2[0].x,r2[0].y,r2[1].x,r2[1].y,r2[2].x,r2[2].y,r2[3].x,r2[3].y);

    },
//проверяет столкновение 2 прямоугольников по описанным вокруг них кругам (предварительная проверка)
    rHitTest:function(obj1,obj2){
        //рад1+рад2<=расст м-у точками
        return (Math.sqrt(obj1.w*obj1.w+obj1.h*obj1.h)+Math.sqrt(obj2.w*obj2.w+obj2.h*obj2.h))/2>=Math.sqrt((obj2.l-obj1.l)*(obj2.l-obj1.l)+(obj2.t-obj1.t)*(obj2.t-obj1.t));
    },
//Находим коорд. точек прямоуг. относительно нового центра без учета поворота
    getPO:function(obj){
        var o1=new Object();
        o1.x=Math.round(obj.l-obj.w/2);
        o1.y=Math.round(obj.t-obj.h/2);
        var o2=new Object();
        o2.x=o1.x+obj.w;
        o2.y=o1.y;
        var o3=new Object();
        o3.x=o2.x;
        o3.y=o1.y+obj.h;
        var o4=new Object();
        o4.x=o1.x;
        o4.y=o3.y;
        return [o1,o2,o3,o4];
    },
//Находим коорд. точек прямоуг. относительно нового центра с учетом поворота
//ob - 4 точки прямоуголника без учета поворота obj - наш объект
    rotObj:function(obj, ob){
        var ro=new Array();
        for(var i=0;i<ob.length;i++)
            ro[ro.length]=this.rotPoint(ob[i].x,ob[i].y,obj.l,obj.t,obj.lAngle);
        return ro;
    },
//Находим коорд. точчки. относительно нового центра с учетом поворота px,py наша точка, сх, сy - сентр. точка angle-угол
    rotPoint :function (PX, PY, Cx,Cy,angle){
        var sinA=Math.sin(angle * (Math.PI / 180) );
        var cosA=Math.cos(angle * (Math.PI / 180) );
        var DX = PX - Cx;
        var DY = PY - Cy;
        var o=new Object();
        o.x = Cx + Math.round(DX * cosA - DY * sinA);
        o.y = Cy + Math.round(DX * sinA + DY * cosA);
        return o;
    },
//Пересекает ли линия a(x,y)-b(x,y) линию с(x,y)-d(x,y)
    isLinePartsIntersected:function(a, b, c, d){
        var common = (b.x - a.x)*(d.y - c.y) - (b.y - a.y)*(d.x - c.x);
        if (common == 0) return false;
        var rH = (a.y - c.y)*(d.x - c.x) - (a.x - c.x)*(d.y - c.y);
        var sH = (a.y - c.y)*(b.x - a.x) - (a.x - c.x)*(b.y - a.y);
        var r = rH / common;
        var s = sH / common;
        return r >= 0 && r <= 1 && s >= 0 && s <= 1;
    },
//Функция проверки попадания точки в прямоугольник
//Проверям каждую сторону на положительное расстояние
    _ptoQuad:function (Px, Py, x1, y1, x2, y2, x3, y3, x4, y4){
        if (this._plD(x1, y1, x2, y2, Px, Py) > 0)
            if(this._plD(x2, y2, x3, y3, Px, Py) > 0)
                if (this._plD(x3, y3, x4, y4, Px, Py) > 0)
                    if(this._plD(x4, y4, x1, y1, Px, Py) > 0)
                        return true;
        return false;
    },
//Расстояние от точки до прямой
    _plD:function (x1, y1, x2, y2, px, py){
        return (x2 - x1) * (py - y2) - (px - x2) * (y2 - y1)
    },

//чтобы узнать угол на который нужно повернуть объект чтобы он летел в точку x1y1
    getUgolforObj:function(x1,y1,x2,y2){
        return Math.atan2(y1-y2,x1-x2)*180/Math.PI;
    },
//Функция проверяет попадает ли точка в окружность
    getPToCircle:function(Px,Py,Cx,Cy,R){
        return (((Px - Cx)*(Px - Cx) + (Py - Cy)*(Py - Cy)) <= R*R);
    },
//функция проверяет не лежит ли точка внутри многоугольника
//с помощью того же пересечения прямых  - берем любую прямую  идущую к нашей точке выходящую за многоугольник и считаем сколько пересечений у нее будет с нашим объектом
//если нечетное то точка внутри объекта иначе снаружи
    intersection:function (ax1,ay1,ax2,ay2,bx1,by1,bx2,by2){
        var v1,v2,v3,v4;
        v1=(bx2-bx1)*(ay1-by1)-(by2-by1)*(ax1-bx1);
        v2=(bx2-bx1)*(ay2-by1)-(by2-by1)*(ax2-bx1);
        v3=(ax2-ax1)*(by1-ay1)-(ay2-ay1)*(bx1-ax1);
        v4=(ax2-ax1)*(by2-ay1)-(ay2-ay1)*(bx2-ax1);
        return (v1*v2<0) & (v3*v4<0);
    }
});