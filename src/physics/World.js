import ScenePlugin from '../core/ScenePlugin.js';
import Body from './Body.js';

/**
 * Manages multiple physics bodies and colliders
 *
 * @extends module:core~ScenePlugin
 * @memberof module:physics~
 */
class World extends ScenePlugin {

    /**
     * @param {object} options - An options object to setup some properties of this world. Usually passed in by the game config.
     * @param {number} [options.gravityX=0] - The world's gravity along the x-axis.
     * @param {number} [options.gravityY=0] - The world's gravity along the y-axis.
     * @param {number} [options.worldBoundsRestitution=1] - How hard the bodies bounce off the bounds of this world. 0 means they don't bounce. 1 means their velocity gets reversed.
     */
    constructor({
        gravityX = 0,
        gravityY = 0,
        worldBoundsRestitution = 1
    } = {}) {
        super();
        /**
         * The world's gravity along the x-axis.
         *
         * @type {number}
         * @default 0
         */
        this.gravityX = gravityX;
        /**
         * The world's gravity along the y-axis.
         *
         * @type {number}
         * @default 0
         */
        this.gravityY = gravityY;
        /**
         * How hard the bodies bounce off the bounds of this world. 0 means they don't bounce. 1 means their velocity gets reversed.
         *
         * @type {number}
         * @default 1
         */
        this.worldBoundsRestitution = worldBoundsRestitution;
    }

    /**
     * Called by the scene when it starts to do some internal setup for the world.
     */
    init()
    {
        /**
         * Where all the bodies are stored.
         *
         * @type {module:physics~Body[]}
         */
        this.bodies = [];
        /**
         * Where all the colliders are stored.
         *
         * @type {objects[]}
         */
        this.colliders = [];
        this.scene.on('addedchild', (child) => {
            if (child.body) {
                this.addBody(child.body);
            }
        });
        this.scene.on('removedchild', (child) => {
            if (child.body) {
                this.removeBody(child.body);
            }
        });
    }

    /**
     * Adds a body to this world.
     *
     * @param {module:physics~Body} body - The body to add.
     */
    addBody(body)
    {
        this.bodies.push(body);
    }

    /**
     * Remove a body from this world and unlinks the colliders.
     *
     * @param {module:physics~Body} body - The body to remove.
     */
    removeBody(body)
    {
        let colliders = this.getCollidersOfBody(body);
        colliders.forEach((collider) => {
            this.removeCollider(collider);
        });
        this.bodies.splice(this.bodies.indexOf(body), 1);
    }

    /**
     * Returns all the colliders associated with the body.
     *
     * @param {module:physics~Body} body - The body to check.
     * @returns {objects[]}
     */
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

    /**
     * Adds a collider.
     *
     * @param {object} config - A config object setting the properties for the collider.
     * @param {module:gameobjects~GameObject} config.a - The first game object.
     * @param {module:gameobjects~GameObject} config.b - The second game object.
     * @param {function} [config.callback] - A callback to execute when both gameobjects collide.
     * @param {boolean} [config.seperate=true] - Wether or not to seperate the game objects. Set to false to overlap only.
     * @returns {object}
     */
    addCollider({
        a = undefined,
        b = undefined,
        callback = undefined,
        seperate = true
    } = {}){
        if (!a || !b || !a.body || !b.body) {
            return;
        }
        let collider = {a: a.body, b: b.body, callback: callback, seperate: seperate};
        this.colliders.push(collider);
        return collider;
    }

    /**
     * Removes a collider.
     *
     * @param {object} collider - The object that was returned by [addCollider]{@link module:physics~World#addCollider}
     */
    removeCollider(collider)
    {
        this.colliders.splice(this.colliders.indexOf(collider), 1);
    }

    /**
     * Checks wether 2 bodies are overlapping.
     *
     * @param {module:physics~Body} a - The first body.
     * @param {module:physics~Body} b - The second body.
     * @returns {boolean}
     */
    collideRect(a, b)
    {
        if (a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right) {
            return false;
        }

        return true;
    }

    /**
     * Seprates two bodies that are colliding and displaces the first body.
     *
     * @param {module:physics~Body} a - The first body.
     * @param {module:physics~Body} b - The second body.
     * @param {number} delta - The time elapsed (in seconds) since the last frame.
     */
    seperateAFromB(a, b, delta)
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

            // If a is approaching from the right
            if (dx < 0) {
                a.x = b.right;
                a.blocked.left = true;

            // If a is approaching from the left
            } else {
                a.x = b.left - a.width;
                a.blocked.right = true;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;
                a.blocked.top = true;

            // If a is approaching from the top
            } else {
                a.y = b.top - a.height;
                a.blocked.bottom = true;
            }

            // Randomly select a x/y direction to reflect velocity on
            if (Math.random() < .5) {

                a.vx = -a.vx * b.restitution;

                // If the object's velocity is nearing 0, set it to 0
                // treshhold is set to .0004
                if (Math.abs(a.vx) < .0004) {
                    a.vx = 0;
                }

                a.x += b.vx * b.frictionX * delta;

            } else {

                a.vy = -a.vy * b.restitution;
                if (Math.abs(a.vy) < .0004) {
                    a.vy = 0;
                }

                a.y += b.vy * b.frictionY * delta;
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                a.x = b.right;
                a.blocked.left = true;
            } else {
            // If a is approaching from the left
                a.x = b.left - a.width;
                a.blocked.right = true;
            }

            a.vx = -a.vx * b.restitution;
            a.x += b.vx * b.frictionX * delta;

            if (Math.abs(a.vx) < .0004) {
                a.vx = 0;
            }

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                a.y = b.bottom;
                a.blocked.top = true;
            } else {
            // If a is approaching from the top
                a.y = b.top - a.height;
                a.blocked.bottom = true;
            }

            a.vy = -a.vy * b.restitution;
            a.y += b.vy * b.frictionY * delta;

            if (Math.abs(a.vy) < .0004) {
                a.vy = 0;
            }
        }

        a.blocked.none = false;
    }

    /**
     * Seprates two bodies that are colliding and displaces them both.
     *
     * @param {module:physics~Body} a - The first body.
     * @param {module:physics~Body} b - The second body.
     * @param {number} delta - The time elapsed (in seconds) since the last frame.
     */
    seperateBoth(a, b, delta)
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

            // If a is approaching from the right
            if (dx < 0) {
                let overlap = (b.right - a.left) / 2;
                a.x += overlap;
                b.x -= overlap;

                a.touching.left = true;
                b.touching.right = true;

            // If a is approaching from the left
            } else {
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;

                a.touching.right = true;
                b.touching.left = true;
            }

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

                a.touching.top = true;
                b.touching.bottom = true;

            // If a is approaching from the top
            } else {
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;

                a.touching.bottom = true;
                b.touching.top = true;
            }

        // If a is approaching from the sides
        } else if (absDX > absDY) {

            // If a is approaching from the right
            if (dx < 0) {
                let overlap = (b.right - a.left) / 2;
                a.x += overlap;
                b.x -= overlap;

                a.touching.left = true;
                b.touching.right = true;

                if (this.gravityX > 0) {
                    b.vy = 0;
                    b.y += a.vy * a.frictionY * delta;
                } else if (this.gravityX < 0) {
                    a.vy = 0;
                    a.y += b.vy * b.frictionY * delta;
                }
            } else {
            // If a is approaching from the left
                let overlap = (a.right - b.left) / 2;
                a.x -= overlap;
                b.x += overlap;

                a.touching.right = true;
                b.touching.left = true;

                if (this.gravityX > 0) {
                    a.vy = 0;
                    a.y += b.vy * b.frictionY * delta;
                } else if (this.gravityX < 0) {
                    b.vy = 0;
                    b.y += a.vy * a.frictionY * delta;
                }
            }

        // If this collision is coming from the top or bottom
        } else {

            // If a is approaching from the bottom
            if (dy < 0) {
                let overlap = (b.bottom - a.top) / 2;
                a.y += overlap;
                b.y -= overlap;

                a.touching.top = true;
                b.touching.bottom = true;

                if (this.gravityY > 0) {
                    b.vy = 0;
                    b.x += a.vx * a.frictionX * delta;
                } else if (this.gravityY < 0) {
                    a.vy = 0;
                    a.x += b.vx * b.frictionX * delta;
                }

            } else {
            // If a is approaching from the top
                let overlap = (a.bottom - b.top) / 2;
                a.y -= overlap;
                b.y += overlap;

                a.touching.bottom = true;
                b.touching.top = true;

                if (this.gravityY > 0) {
                    a.vy = 0;
                    a.x += b.vx * b.frictionX * delta;
                } else if (this.gravityY < 0) {
                    b.vy = 0;
                    b.x += a.vx * a.frictionX * delta;
                }
            }
        }
    }

    /**
     * Called on each frame if the scene is active. Before all children are rendered. Updates all the bodies and processes collisions.
     *
     * @param {number} time - The total time (in milliesconds) since the start of the game.
     * @param {number} delta - The time elapsed (in milliseconds) since the last frame.
     */
    update(time, delta)
    {
        delta = delta / 1000; // convert delta to seconds, so we can define velocity in pixels per second

        let gx = this.gravityX * delta;
        let gy = this.gravityY * delta;

        this.bodies.forEach((body) => {

            if (body.allowGravity) {
                body.vx += gx;
                body.vy += gy;
            }

            body.x += body.vx * delta;
            body.y += body.vy * delta;

            // reset collision flags
            body.blocked.none = true;
            body.blocked.top = false;
            body.blocked.right = false;
            body.blocked.bottom = false;
            body.blocked.left = false;

            body.touching.none = true;
            body.touching.top = false;
            body.touching.right = false;
            body.touching.bottom = false;
            body.touching.left = false;
        });

        this.colliders.forEach((collider) => {
            if (this.collideRect(collider.a, collider.b)) {

                if (collider.seperate) {
                    if (!collider.a.immovable && collider.b.immovable) {
                        this.seperateAFromB(collider.a, collider.b, delta);
                    } else if (collider.a.immovable && !collider.b.immovable) {
                        this.seperateAFromB(collider.b, collider.a, delta);
                    } else if (!collider.a.immovable && !collider.b.immovable) {
                        this.seperateBoth(collider.a, collider.b, delta);
                    }
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
                        body.blocked.left = true;
                    }
                    if (body.top < this.bounds.y) {
                        body.y = this.bounds.y;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                        body.blocked.top = true;
                    }
                    if (body.right > this.bounds.x + this.bounds.width) {
                        body.x = this.bounds.x + this.bounds.width - body.width;
                        body.vx = -body.vx * this.worldBoundsRestitution;
                        body.blocked.right = true;
                    }
                    if (body.bottom > this.bounds.y + this.bounds.height) {
                        body.y = this.bounds.y + this.bounds.height - body.height;
                        body.vy = -body.vy * this.worldBoundsRestitution;
                        body.blocked.bottom = true;
                    }
                }
            });
        }
    }

    /**
     * Helper to set the bounds of this world.
     *
     * @param {number} x - The left x position of the area relative to the scene's origin.
     * @param {number} y - The top y position of the area relative to the scene's origin.
     * @param {number} width - The width of the area.
     * @param {number} height - The height of the area.
     */
    setBounds(x, y, width, height)
    {
        this.bounds = {x, y, width, height};
    }

    /**
     * Automatically called when the scen shuts down. Removes the references to the bodies and the colliders.
     */
    shutdown()
    {
        super.shutdown();
        this.bodies = [];
        this.colliders = [];
    }
}
export default World;
