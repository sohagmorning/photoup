
class Figure {
    double dim1;  
    double dim2;  
    
    Figure(double a, double b) {
        dim1 = a;
        dim2 = b;
    }
    
    double area() {
        System.out.println("Area for Figure is undefined.");
        return 0;
    }
}

class Rectangle extends Figure {
    Rectangle(double a, double b) {
        super(a, b);  
    }
    
    double area() {
        System.out.println("Inside Area for Rectangle.");
        return dim1 * dim2; 
        }
}

class Triangle extends Figure {
    
    Triangle(double a, double b) {
        super(a, b);
    }
    
    double area() {
        System.out.println("Inside Area for Triangle.");
        return dim1 * dim2 / 2;  
        }
}

class sohag  {
    public static void main(String args[]) {
        Figure f = new Figure(10, 10);      
        Rectangle r = new Rectangle(9, 5); 
        Triangle t = new Triangle(10, 8);   
        
        Figure figref;
        
        System.out.println("=== Testing Polymorphism ===");
        System.out.println();
        
        figref = r;  
        System.out.println("1. figref pointing to Rectangle object:");
        System.out.println("Area is " + figref.area());  
        System.out.println();
        
        figref = t;  
        System.out.println("2. figref pointing to Triangle object:");
        System.out.println("Area is " + figref.area());  
        System.out.println();
        
        figref = f;  
        System.out.println("3. figref pointing to Figure object:");
        System.out.println("Area is " + figref.area()); 
        System.out.println();
        
        System.out.println("=== Direct Calls for Comparison ===");
        System.out.println("Rectangle area directly: " + r.area());
        System.out.println("Triangle area directly: " + t.area());
        System.out.println("Figure area directly: " + f.area());
    }
}