/**
 * Module initializer.
 */
function system_manager_init() {
    // List of registered systems update callbacks.
    // Systems will be processed in the order they are added.
    _system_update_cbs = [];

    // Maps a system name to the system.
    _systems_map = {};
}


/**
 * Updates all the systems.
 * @param dt Elapsed time since last call.
 */
function system_manager_update(dt) {
    for( var i = 0; i < _system_update_cbs.length; i++ ) {
        _system_update_cbs[i](dt);
    }
}

/**
 * Registers a system. Systems will be updated in the registered order.
 * @param system_name Name of the system to register.
 * @param update_cb System update callback to register.
 */
function system_manager_register(system_name, update_cb) {
    if( system_name in _systems_map ) {
        throw new Error("Attempted to register the system '" + system_name + "' twice");
    }

    _systems_map[system_name] = update_cb;
    _system_update_cbs.push(update_cb);
}

/**
 * Unregisters all systems.
 */
function system_manager_unregister_all() {
    _system_update_cbs = [];
    _systems_map = {};
}
