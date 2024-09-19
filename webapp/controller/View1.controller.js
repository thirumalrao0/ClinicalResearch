sap.ui.define([
  "sap/ui/core/mvc/Controller", "sap/ui/core/Fragment", "sap/m/MessageToast", "sap/ui/model/Filter", "sap/ui/model/Sorter"
],
  function (Controller,
    Fragment,
    MessageToast,
    Filter,
    Sorter) {
    "use strict";
    return Controller.extend("task.thirumal.controller.View1", {
      onInit: function () {

        this.fModel = this.getOwnerComponent().getModel()
        this.fModel.setDeferredGroups(this.fModel.getDeferredGroups().concat(
          ["create", "update"]
        ))
      },
      addBtn() {
        var newData = this.fModel.createEntry("/CRGendata", { groupId: "create" })
        Fragment.load({
          id: this.getView().getId(),
          name: "task.thirumal.fragments.add",
          controller: this
        }).then((f) => {
          this.getView().addDependent(f)
          f.setBindingContext(newData)
          f.open()

        })
      },
      onAdd(evn) {
        this.fModel.submitChanges({
          success: () => {
            MessageToast.show("data added")
            evn.getSource().getParent().getParent().close()
          },
          error: (err) => {
            MessageToast.show(err)
          }
        })
      },
      cancel(evn) {
        evn.getSource().getParent().getParent().close()
        this.fModel.resetChanges()
      },
      page2(evn) {
        sap.ui.core.BusyIndicator.show(0);
        this.getOwnerComponent().getRouter().navTo("RouteView2", {
          
          path: window.encodeURIComponent(evn.getSource().getBindingContext().getPath())
          
 
        })
 
      },
      onDelete() {
        var sTable = this.byId("smartTable")
        var gTable = sTable.getTable()
        var indices = gTable.getSelectedItems()
        this.byId("deleteId").setEnabled(false);
        indices.forEach(item => {
          var spath = item.getBindingContext().getPath()
          this.fModel.remove(spath, {
            success: () => {
              MessageToast.show("deleted")
            },
            error: (err) => {
              MessageToast.show(err)
            }
          })
        });
      },
      onSelectionChange() {

        var sTable = this.byId("smartTable");
        var gTable = sTable.getTable();
        var indices = gTable.getSelectedItems();


        if (indices.length > 0) {
          this.byId("deleteId").setEnabled(true);
        } else {
          this.byId("deleteId").setEnabled(false);
        }
      },
      // search(evn) {
      //   var query = evn.getParameter("query")
      //   var afilter = new Filter({
      //     filters: [
      //       new Filter("SiteCode", "Contains", query),
      //       new Filter("SiteName", "Contains", query),
      //       new Filter("CRCode", "Contains", query),
      //       new Filter("CRName", "Contains", query),
      //       new Filter("Specialities", "Contains", query),
      //       new Filter("CVAvailable", "Contains", query),
      //       new Filter("Status", "Contains", query)
      //     ]
      //   })
      //   var sTable = this.byId("smartTable")
      //   var gTable = sTable.getTable()
      //   var binding = gTable.getBinding("items")
      //   binding.filter(afilter)
      // },
      sortDialog() {
        Fragment.load({
          id: this.getView().getId(),
          name: "task.thirumal.fragments.sort",
          controller: this
        }).then((frag) => {
          this.getView().addDependent(frag)
          frag.open()
        });
      },

      sortCol(oEvent) {
        var parms = oEvent.getParameters();
        var spath = parms.sortItem.getKey();
        var dec = parms.sortDecending
        var arr = []
        arr.push(new Sorter(spath, dec));
        var oTable = this.byId("smartTable").getTable().getBinding("items")
        oTable.sort(arr)

      }


    });
  });
