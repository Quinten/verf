import Body from './Body.js';

class World {

    constructor({
        gravityX = 0,
        gravityY = 0
    } = {}) {
        this.gravityX = gravityX;
        this.gravityY = gravityX;
        this.worldBoundsRestitution = 1;
        this.bodies = [];
        this.colliders = [];
    }

    addBody(body)
    {
        this.bodies.push(body);
    }

    removeBody(body)
    {
        let colliders = this.getCollidersOfBody(body);
        colliders.forEach((collider) => {
            this.removeCollider(collider);
        });
        this.bodies.splice(this.bodies.indexOf(body), 1);
    }

    getCollidersOfBody(body)
    {
        let colliders = [];
        this.colliders.forEach((collider) => {
            if (collider.a == body || collider.b == body) {
                colliders.push(collider);
            }
        });
        return colliders;
    }

    addCollider({
        a = undefined,
        b = undefined,
        callback = undefined
    } = {}){
        if (!a || !b || !a.body || !b.body) {
            return;
        }
        let collider = {a: a.body, b: b.body, callback: callback};
        this.colliders.push(collider);
        return collider;
    }

    removeCollider(collider)
    {
        this.colliders.splice(this.colliders.indexOf(collider), 1);
    }

    collideRect(a, b)
    {
        if (a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right) {
            return false;
        }

        return true;
    }

    seperateAFromB(a, b)
    {
        // To find the side of entry calculate based on
        // the normalized sides
        let dx = (b.midX - a.midX) / b.halfWidth;
        let dy = (b.midY - a.midY) / b.halfHeight;

        // Calculate the absolute change in x and y
        let absDX = Math.abs(dx);
        let absDY = Math.abs(dy);

        // If the distance between the normalized x and y
        // position is less than a small threshold (.1 in this case)
        // then this object is approaching from a corner
        if (Math.abs(absDX - absDY) < .1) {

            // If a is approaching from positive X
            if (dx < 0) {

                // Set a.x to the right side
                a.x = b.right;

            // If a is approaching from negative X
            } else {

                // Set a to the left side
                a.x = b.left - a.width;
            }

            // If a is approaching from positive Y
            if (dy < 0) {

                // Set a to the bottom
                a.y = b.bottom;

            // If a is approaching from negative Y
            } else {

                // Set the player y to the top
                a.y = b.top - a.height;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                // Reflect the velocity at a reduced rate
                a.vx = -a.vx * b.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // treshhold is set to .0004
                if (Math.abs(a.vx) < .0004) {
                    a.vx = 0;
                }

            } else {

                a.vy = -a.vy * b.restitution;
                if (Math.abs(a.vy) < .0004) {
                    a.vy = 0;
                }
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from positive X
            if (dx < 0) {
                a.x = b.right;
            } else {
            // If a is approaching from negative X
                a.x = b.left - a.width;
            }

            // Velocity component
            a.vx = -a.vx * b.restitution;

            if (Math.abs(a.vx) < .0004) {
                a.vx = 0;
            }

        // If this collision is coming from the top or bottom more
        } else {

            // If a is approaching from positive Y
            if (dy < 0) {
                a.y = b.bottom;

            } else {
            // If a is approaching from negative Y
                a.y = b.top - a.height;
            }

            // Velocity component
            a.vy = -a.vy * b.restitution;
            if (Math.abs(a.vy) < .0004) {
                a.vy = 0;
            }
        }
    }

    step(delta)
    {
        let gx = this.gravityX * delta;
        let gy = this.gravityY * delta;

        this.bodies.forEach((body) => {
            switch (body.type) {
                case Body.DYNAMIC:
                    body.vx += body.ax * delta + gx;
                    body.vy += body.ay * delta + gy;
                    body.x  += body.vx * delta;
                    body.y  += body.vy * delta;
                    break;
                case Body.KINEMATIC:
                    body.vx += body.ax * delta;
                    body.vy += body.ay * delta;
                    body.x  += body.vx * delta;
                    body.y  += body.vy * delta;
                    break;
             }
        });

        this.colliders.forEach((collider) => {
            if (this.collideRect(collider.a, collider.b)) {
                if (collider.a.type == Body.DYNAMIC && collider.b.type == Body.KINEMATIC) {
                    this.seperateAFromB(collider.a, collider.b);
                } else if (collider.a.type == Body.KINEMATIC && collider.b.type == Body.DYNAMIC) {
                    this.seperateAFromB(collider.b, collider.a);
                } else if (collider.a.type == Body.DYNAMIC && collider.b.type == Body.DYNAMIC) {
                    // TODO: create a seperateBoth function
                }
                if (collider.callback) {
                    collider.callback(collider.a, collider.b);
                }
            }
        });

        if (this.bounds) {
            this.bodies.forEach((body) => {
                if (body.collideWorldBounds) {
                    if (body.left < this.bounds.x) {
                        body.x = this.bounds.x;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                    }
                    if (body.top < this.bounds.y) {
                        body.y = this.bounds.y;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                    }
                    if (body.right > this.bounds.x + this.bounds.width) {
                        body.x = this.bounds.x + this.bounds.width - body.width;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                    }
                    if (body.bottom > this.bounds.y + this.bounds.height) {
                        body.y = this.bounds.y + this.bounds.height - body.height;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                    }
                }
            });
        }
    }

    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }

    destroy()
    {
        this.bodies = [];
        this.colliders = [];
    }
}
export default World;
