/*
 * File: app/model/UuidGenerator.js
 *
 * This file was generated by Sencha Architect version 3.0.4.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('syncbook.model.UuidGenerator', {
    extend: 'Ext.data.Model',

    requires: [
        'Ext.data.UuidGenerator',
        'Ext.data.Field'
    ],

    idProperty: 'UUID',

    idgen: {
        type: 'uuid',
        id: 'UUID'
    },

    fields: [
        {
            name: 'UUID'
        }
    ]
});