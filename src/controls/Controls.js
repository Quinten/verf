import Events from '../core/Events.js';

class Controls extends Events {

    init()
    {
    }

    destroy()
    {
        this.off();
    }
}
export default Controls;
