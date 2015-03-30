/*
 * File: app/controller/EventOptionController.js
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

Ext.define('syncbook.controller.EventOptionController', {
    extend: 'Ext.app.Controller',

    refs: [
        {
            ref: 'ModEventOptionWindow',
            selector: 'ModEventOptionWindow_ua'
        }
    ],

    optionsEventClick: function(button, e, eOpts) {
        this.eventOptionButton();
    },

    modEventOptionSubmitClick: function(button, e, eOpts) {
        if(syncTaskEvent === null) {
            this.taskFunction();
        } else {
            syncTaskEvent.stop();
        }

        this.eventOptionSubmitButton();
    },

    viewportBeforeRender: function(component, eOpts) {
        this.taskFunction();
    },

    eventOptionButton: function() {
        var mySelf = this;

        Ext.Ajax.request({
            url: "resources/libraries/syncbookServices/optionService.php",
            params: {
                syncType: "caldav"
            },

            success: function(response) {
                var operationResult = Ext.decode(response.responseText);

                if(operationResult.option.errorSuccess != 'undefined' && operationResult.option.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.option.errorCode+" has occoured = "+operationResult.option.errorDescription);
                } else {
                    var modEventOptionWindow = Ext.create("syncbook.view.ModEventOptionWindow");

                    if(operationResult.option.syncflag*1 === 0) {
                        mySelf.getModEventOptionWindow().getComponent('modEventOptionForm').getForm().findField('synctime').setDisabled(true);
                    }

                    var toLoadSyncRecord = Ext.create("syncbook.model.SyncModel", {
                        synctype: operationResult.option.synctype,
                        syncflag: operationResult.option.syncflag*1,
                        synctime: operationResult.option.synctime
                    });

                    mySelf.getModEventOptionWindow().getComponent('modEventOptionForm').loadRecord(toLoadSyncRecord);
                    modEventOptionWindow.show();
                }
            },

            failure: function(response) {
                Ext.Msg.show({
                    title: "Response Error",
                    msg: "Response Error Message",
                    buttons: Ext.Msg.OK,
                    closable: false,
                    scope: this,
                    icon: Ext.window.MessageBox.ERROR
                });
            }
        });
    },

    eventOptionSubmitButton: function() {
        var mySelf = this;

        var auxiliarForm = mySelf.getModEventOptionWindow().getComponent('modEventOptionForm').getForm();
        formRecord = auxiliarForm.getRecord();
        auxiliarForm.updateRecord(formRecord);
        auxiliarForm.clearInvalid();

        if(auxiliarForm.isValid()) {
            mySelf.getModEventOptionWindow().close();
            formRecord.setDirty();

            Ext.Ajax.request({
                url: "resources/libraries/syncbookServices/optionService.php",
                params: {
                    syncType: "caldav",
                    newSyncOption: Ext.encode(formRecord.data)
                },

                success: function(response) {
                    var operationResult = Ext.decode(response.responseText);

                    if(operationResult.option.errorSuccess != 'undefined' && operationResult.option.errorSuccess === false) {
                        console.error("An error with code : "+operationResult.option.errorCode+" has occoured = "+operationResult.option.errorDescription);
                    } else {
                        mySelf.taskFunction();
                    }
                },

                failure: function(response) {
                    Ext.Msg.show({
                        title: "Response Error",
                        msg: "Response Error Message",
                        buttons: Ext.Msg.OK,
                        closable: false,
                        scope: this,
                        icon: Ext.window.MessageBox.ERROR
                    });
                }
            });
        } else {
            Ext.Msg.show({
                title: "Form Error",
                msg: "Uncorrect Form Compilation",
                buttons: Ext.Msg.OK,
                closable: false,
                scope: this,
                icon: Ext.window.MessageBox.ERROR
            });
        }
    },

    taskFunction: function() {
        Ext.Ajax.request({
            url: "resources/libraries/syncbookServices/optionService.php",
            params: {
                syncType: "caldav"
            },

            success: function(response) {
                var operationResult = Ext.decode(response.responseText);

                if(operationResult.option.errorSuccess != 'undefined' && operationResult.option.errorSuccess === false) {
                    console.error("An error with code : "+operationResult.option.errorCode+" has occoured = "+operationResult.option.errorDescription);
                } else {

                    if(operationResult.option.syncflag*1 == 1) {
                        var runner = new Ext.util.TaskRunner();

                        syncTaskEvent = runner.newTask({
                            run: function () {
                                // console.log("Timestamp Event", Ext.util.Format.date(new Date(), 'H:i:s'));
                                syncbook.app.getController('EventActionController').syncEventsFunction();
                            },

                            interval: operationResult.option.synctime*1000
                        });

                        syncTaskEvent.start();
                    } else {
                        if(syncTaskEvent !== null)
                            syncTaskEvent.stop();
                    }
                }
            },

            failure: function(response) {
                Ext.Msg.show({
                    title: "Response Error",
                    msg: "Response Error Message",
                    buttons: Ext.Msg.OK,
                    closable: false,
                    scope: this,
                    icon: Ext.window.MessageBox.ERROR
                });
            }
        });
    },

    init: function(application) {
        this.control({
            "#optionsEvent": {
                click: this.optionsEventClick
            },
            "#modEventOptionSubmit": {
                click: this.modEventOptionSubmitClick
            },
            "#myviewport": {
                beforerender: this.viewportBeforeRender
            }
        });
    }

});
