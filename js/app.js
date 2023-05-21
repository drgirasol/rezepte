import { createApp } from "https://unpkg.com/petite-vue@0.2.2/dist/petite-vue.es.js";

createApp({
    PouchDB: null,
    // Schalter
    addProdukt: false,
    addSchrittProdukt: false,
    addMaterial: false,
    //
    dbRezepte: null, //datenbankverbindungen
    dbMaterialien: null,
    dbProdukte: null,
    rezepte: [], //datensammlungen
    materialien: [],
    produkte: [],
    rezept: () => {
        return {
            _id: "",
            name: "",
            anleitung: {
                schritte: [],
            },
        }
    },
    curRezept: {},
    curSchritt: 1,
    schritt: () => {
        return {
            nr: "",
            text: "",
            zeit: {
                dauer: "",
                typ: "",
            },
            materialien: [],
            produkte: [],
        }
    },
    schrittProdukt: () => {
        return {
            produktId: "",
            preis: 0,
            gewicht: 0
        }
    },
    curProdukt: null,
    produkt: {
        _id: "",
        qualitaet: 0,
        verpackung: 0,
        verfuegbarkeit: 0,
        saison: 0,
        herkunft: 0,
        kategorie: 0,
    },
    material: {
        _id: "",
    },
    fMaterial: "", //formularvariablen (einträge)
    fProdukt: "",
    fRezeptName: "",
    asText: "",
    asDauer: 0,
    asTyp: "",
    schrittChanged: {},
    saved: false,
    schrittProduktFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbProdukte: null,
            schrittProdukt: {
                produktId: props.produkt._id,
                preis: 0,
                gewicht: 0
            },
            schritt: props.schritt,
            $template: "#schritt-produkt-form-template",
            edit(id) {
                const curProdukt = this.produkte.find(p => p._id === id)
                console.log(curProdukt)
                this.preis = curProdukt.preis
            },
            async updateProdukte() {
                const result = await this.dbProdukte.allDocs({
                    include_docs: true,
                });
                console.log("Produkte:", result);
                this.produkte = result.rows.map(r => r.doc);
            },
            async insertSchrittProdukt() {
                // Prüfen ob Preis und Gewicht angegeben wurden
                console.log("schrittProdukt hinzufügen", this.schrittProdukt)
                props.rezept.anleitung.schritte[props.schritt-1].produkte.push(this.schrittProdukt)
            },
            schrittProduktAbbrechen() {
                this.$refs.schrittProduktform.dispatchEvent(
                    new CustomEvent('canceled', { bubbles: true, detail: null })
                )
            },
            async upsertProdukt() {
                let produkt;
                try {
                    produkt = await this.dbProdukte.get(this.name);
                } catch (err) {
                    if (err.name === "not_found") {
                        // falls der Eintrag dort nicht existiert
                        produkt = {
                            // gib einen neuen Eintrag zurück, der dann in die DB geschrieben werden kann
                            _id: this.name,
                            date: new Date().toISOString(),
                        };
                    } else {
                        // hm, some other error
                        throw err;
                    }
                }
                try {
                    const response = await this.dbProdukte.put(produkt);
                    console.log("Eintrag gespeichert", response);
                    await this.updateProdukte();
                } catch (err) {
                    console.log(err);
                }
            },
            async init() {
                this.dbProdukte = new PouchDB("Produkte");
                await this.updateProdukte();
                console.log("Komponente mounted", this.produkte);
            },
        };
    },
    produktFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbProdukte: null,            
            name: props.name,
            produkte: [],
            $template: "#produkt-form-template",
            edit(id) {
                const curProdukt = this.produkte.find(p => p._id === id)
                console.log(curProdukt)
                this.name = curProdukt._id
            },
            async updateProdukte() {
                const result = await this.dbProdukte.allDocs({
                    include_docs: true,
                });
                console.log("Produkte:", result);
                this.produkte = result.rows.map(r => r.doc);
            },
            async insertProdukt() {
                let produkt = {
                    _id: this.name,
                    date: new Date().toISOString(),
                };
                console.log("neues Produkt", produkt)
                try {
                    const response = await this.dbProdukte.put(produkt);
                    console.log("Eintrag gespeichert", response);
                    await this.updateProdukte();
                    // toDo: emit event from component as demonstrated here: https://jsfiddle.net/nooooooom/fsk7bm6j/7/
                    // => goal: after the product was inserted, include it in the rezept and close the product add form
                    this.$refs.produktform.dispatchEvent(
                        new CustomEvent('finished', { bubbles: true, detail: produkt })
                    )
                } catch (err) {
                    console.log(err);
                }
            },
            produktAbbrechen() {
                this.$refs.produktform.dispatchEvent(
                    new CustomEvent('canceled', { bubbles: true, detail: null })
                )

            },
            async upsertProdukt() {
                let produkt;
                try {
                    produkt = await this.dbProdukte.get(this.name);
                } catch (err) {
                    if (err.name === "not_found") {
                        // falls der Eintrag dort nicht existiert
                        produkt = {
                            // gib einen neuen Eintrag zurück, der dann in die DB geschrieben werden kann
                            _id: this.name,
                            date: new Date().toISOString(),
                        };
                    } else {
                        // hm, some other error
                        throw err;
                    }
                }
                try {
                    const response = await this.dbProdukte.put(produkt);
                    console.log("Eintrag gespeichert", response);
                    await this.updateProdukte();
                } catch (err) {
                    console.log(err);
                }
            },
            async init() {
                this.dbProdukte = new PouchDB("Produkte");
                await this.updateProdukte();
                console.log("Komponente mounted", this.produkte);
            },
        };
    },
    //
    materialFormKomponente(props) {
        return {
            PouchDB: props.pdb,
            self: props.self,
            dbMaterialien: null,
            name: props.name,
            materialien: [],
            $template: "#material-form-template",
            edit(id) {
                const curMaterial = this.materialien.find(m => m._id === id)
                console.log(curMaterial)
                this.name = curMaterial._id

            },
            async updateMaterialien() {
                const result = await this.dbMaterialien.allDocs({
                    include_docs: true,
                });
                console.log("Materialien:", result);
                this.materialien = result.rows.map(r => r.doc);
            },
            async insertMaterial() {
                let material = {
                    _id: this.name,
                    date: new Date().toISOString(),
                };
                try {
                    const response = await this.dbMaterialien.put(material);
                    console.log("Eintrag gespeichert", response);
                    await this.updateMaterialien();
                    // toDo: emit event from component as demonstrated here: https://jsfiddle.net/nooooooom/fsk7bm6j/7/
                    // => goal: after the product was inserted, include it in the rezept and close the product add form
                    this.$refs.materialform.dispatchEvent(
                        new CustomEvent('finished', { bubbles: true, detail: material })
                    )
                } catch (err) {
                    console.log(err);
                }
            },
            async upsertMaterial() {
                let material;
                try {
                    material = await this.dbMaterialien.get(this.name);
                } catch (err) {
                    if (err.name === "not_found") {
                        // falls der Eintrag dort nicht existiert
                        material = {
                            // gib einen neuen Eintrag zurück, der dann in die DB geschrieben werden kann
                            _id: this.name,
                            date: new Date().toISOString(),

                        };
                    } else {
                        // hm, some other error
                        throw err;
                    }
                }
                try {

                    const response = await this.dbMaterialien.put(material);
                    console.log("Eintrag gespeichert", response);
                    await this.updateMaterialien();
                } catch (err) {
                    console.log(err);
                }
            },
            materialAbbrechen() {

                this.$refs.materialform.dispatchEvent(
                    new CustomEvent('canceled', { bubbles: true, detail: null })
                )

            },
            async init() {
                this.dbMaterialien = new PouchDB("Materialien");
                await this.updateMaterialien();
                console.log("Komponente mounted", this.materialien);
            },
        };
    },
    async produktHinzugefuegt(data) {
        console.log(data)
        this.addProdukt = false
        this.curProdukt = data.detail
        this.addSchrittProdukt = true
        // this.curRezept.anleitung.schritte[this.curSchritt - 1].produkte.push(data.detail);
        // await this.upsertRezept();
    },
    async materialHinzugefuegt(data) {
        console.log(data)
        this.addMaterial = false
        //this.curRezept.anleitung.schritte[this.curSchritt - 1].materialien.push(data.detail);
        // await this.upsertRezept();
    },
    async onMounted() {
        console.log("onMounted startet...");
        this.dbRezepte = new PouchDB("Rezept"); //greift auf die datenbank zu, bzw erzeugt sie wenn nicht vorhanden
        await this.update("Rezepte"); //der string rezepte wird der update funktion übergeben
        this.dbMaterialien = new PouchDB("Materialien");
        await this.update("Materialien");
        this.dbProdukte = new PouchDB("Produkte")
        await this.update("Produkte")
        console.log("Datenbanken initialisiert...", this.rezept());
        this.curRezept = this.rezept()
        this.curRezept.anleitung.schritte.push(this.schritt())
    },
    async update(dbName) {
        const result = await this["db" + dbName].allDocs({
            include_docs: true,
        });

        console.log(result);

        this[dbName.toLowerCase()] = result.rows.map((r) => r.doc);
    },
    insertMaterial() {
    },
    displayCount() {
    },
    save() {

    },
    setSchrittChanged(nr) {
        this.schrittChanged[nr] = true;
    },
    schrittUnchanged(nr) {
        return !this.schrittChanged[nr];
    },
    async addStep(save = true) {
        const neuerSchritt = this.schritt();
        console.log("neuer schritt", neuerSchritt)
        console.log("...", this.curRezept)
        neuerSchritt.nr = this.curRezept.anleitung.schritte.length + 1;
        this.curRezept.anleitung.schritte.push(neuerSchritt);
        if (save) {
            //await this.upsertRezept();
        }
    },
    async upsertRezept(save = true) {
        try {
            const savedRezept = await this.dbRezepte.find({ selector: { name: this.fRezeptName } });
            console.log("gespeichertes Rezept", savedRezept);
            if (!this.curRezept._id) {
                this.curRezept = savedRezept;
            } else {
                this.curRezept._rev = savedRezept._rev; // update _rev
            }
        } catch (err) {
            if (err.name === "not_found") {
                // falls der Eintrag dort nicht existiert
                save = true;
                // this.curRezept._id = this.fRezeptName;
                // Ersten Schritt hinzufügen
                console.log("...")
                await this.addStep();
            } else {
                // hm, some other error
                throw err;
            }
        }
        if (save) {
            try {
                const response = await this.dbRezepte.post(this.curRezept);
                this.schrittChanged = {};
                console.log("Eintrag gespeichert", response);
            } catch (err) {
                console.log(err);
            }
        }
    },
    async onProduktChange(event, schrittNr) {
        if (event.target.value === "0") {
            console.log("Produkt hinzufügen")
            this.addProdukt = true
        } else {
            this.curProdukt = this.produkte.find((p) => p._id === event.target.value)
            this.addSchrittProdukt = true
            this.fProdukt = ""
        }
    },
    async onMaterialChange(event, schrittNr) {
        if (event.target.value === "0") {
            console.log("Material hinzufügen")
            this.addMaterial = true
        } else {            
            let p = Object.assign({}, this.material);
            p = this.materialien.find((m) => m._id === event.target.value);
            this.curRezept.anleitung.schritte[this.curSchritt - 1].materialien.push(p);
            //await this.upsertRezept()
            event.target.value = ""
        }
    },
}).mount("#Rezeptformular");
