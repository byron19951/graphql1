import mongoose, { mongo } from 'mongoose';
import bcrypt from 'bcrypt';
//conexion a la base de datos mongodb
mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost/HUAQuirofanos', { useNewUrlParser: true });
mongoose.connect('mongodb+srv://root:root@cluster0.yqmcw.mongodb.net/HUAGQuirofanos?retryWrites=true&w=majority', { useNewUrlParser: true });

mongoose.set('setFindAndModify', false);
//esquema para crear la tabala clientes en mongo db

///personal hospitalario****-----****

const personalHospitalarioSchema = new mongoose.Schema({
	nombres: String,
	apellidos: String,
	identificacion: String,
	rol: String,
	fechaNacimiento: String,
	usuario: String,
	password: String,
	estado: Boolean,
	imagen: String,
	telefonos: Array,
	emails: Array,

	tipoSangre: String,
	nombreContacto: String,
	telefonoContacto: String,
	tipoIdentificacion: String,
	fechaIngreso: String,

	especialidad: String,
	gestionHorarios: String,
	direcciones: Array
});

personalHospitalarioSchema.pre('save', function(next) {
	if (!this.isModified('password')) {
	}
	bcrypt.genSalt(10, (err, salt) => {
		if (err) return next(err);
		bcrypt.hash(this.password, salt, (err, hash) => {
			if (err) return next(err);
			this.password = hash;
			next();
		});
	});
});

const PersonalHospitalario = mongoose.model('personalHospitalario', personalHospitalarioSchema);

//Esquema para medico Tratante

const medicoTratanteSchema = new mongoose.Schema({
	nombres: String,
	apellidos: String,
	identificacion: String,
	fechaNacimiento: String,
	estado: Boolean,
	imagen: String,
	telefonos: Array,
	emails: Array,
	direcciones: Array,
	nombreContacto: String,
	telefonoContacto: String,
	tipoSangre: String,
	fechaIngreso: String,
	tipoIdentificacion: String,
	especialidad: String
});

const MedicoTratante = mongoose.model('medicoTratante', medicoTratanteSchema);

//Esquema para pacientes

const pacienteSchema = new mongoose.Schema({
	nombres: String,
	apellidos: String,
	identificacion: String,
	fechaNacimiento: String,
	sexo: String,
	peso: Number,
	talla: Number,
	estadoCivil: String,
	procedencia: String,
	ocupacion: String,
	estado: Boolean,
	imagen: String,
	telefonos: Array,
	emails: Array,
	direcciones: Array,
	tipoSangre: String,
	nombreContacto: String,
	telefonoContacto: String,
	tipoIdentificacion: String
});

const Paciente = mongoose.model('paciente', pacienteSchema);

//esquema para Turnos
const turnoSchema = new mongoose.Schema({
	abreviatura: String,
	descripcion: String,
	estado: Boolean,
	horaEntrada: String,
	horaSalida: String,
	totalHoras: String,
	colorIdentificacion: String
});

const Turno = mongoose.model('turno', turnoSchema);

//esquema para Horario de trabajo
const horarioSchema = new mongoose.Schema({
	personal: mongoose.Types.ObjectId,
	nombrePersonal: String,
	rolUsuario: String,
	fechaCreacion: Date,
	mes: String,
	year: String,
	diasTrabajo: Array,
	totalHoras: Number,
	estado: Boolean
});

const Horario = mongoose.model('horario', horarioSchema);

//esquema para quirofano
const areaMedicaSchema = new mongoose.Schema({
	nombres: String,
	ubicacion: String,
	descripcion: String,
	estado: Boolean
});

const AreaMedica = mongoose.model('areaMedica', areaMedicaSchema);

//esquema para subprocedimiento
const subprocedimientoSchema = new mongoose.Schema({
	nombres: String,
	descripcion: String,
	valorTotal: Number,
	estado: Boolean
});

const Subprocedimiento = mongoose.model('subprocedimiento', subprocedimientoSchema);

//esquema para procedimientos
const procedimientoSchema = new mongoose.Schema({
	nombres: String,
	codigo: String,
	descripcion: String,
	valorTotal: Number,
	estado: Boolean,
	subprocedimiento: Array
});

const Procedimiento = mongoose.model('procedimiento', procedimientoSchema);

//esquema para agendaQuirofano
const agendaQuirofanoSchema = new mongoose.Schema({
	medico: String,
	quirofano: String,
	fecha: String,
	horaEntrada: String,
	horaSalida: String,
	paciente: String,
	diagnostico: String,
	procedimiento: mongoose.Types.ObjectId,
	cancelado: Boolean,
	enfermera: mongoose.Types.ObjectId,
	auxiliar: mongoose.Types.ObjectId,
	valor: Number,
	kitSolicitado: Boolean,
	kitDespachado: Boolean,
	importado: Boolean
});

const AgendaQuirofano = mongoose.model('agendaQuirofano', agendaQuirofanoSchema);

//esquema para registro cirugia anestecia

const registroCirugiaAnesteciaSchema = new mongoose.Schema({
	idMedico: mongoose.Types.ObjectId,
	nombreMedico: String,
	idQuirofano: mongoose.Types.ObjectId,
	nombreQuirofano: String,
	fechaOperacion: String,
	idPaciente: mongoose.Types.ObjectId,
	nombrePaciente: String,
	edad: Number,
	sexo: String,
	peso: Number,
	talla: Number,
	idOperacionRealizada: mongoose.Types.ObjectId,
	nombreOperacion: String,
	diagnosticoPreoperatorio: String,
	riesgo: String,
	anestecia: String,
	recuperacionAldrette: String,
	observacion: String,
	servicio: String,
	idCirujano: mongoose.Types.ObjectId,
	nombreCirujano: String,
	idAyudante: String,
	nombreAyudante: String,
	idAnestesista: String,
	nombreAnestesista: String,
	idIntrumentista: String,
	nombreIntrumentista: String,
	idCirculante: String,
	nombreCirculante: String,
	emergencia: Boolean,
	estado: Boolean
});

const RegistroCirugiaAnestecia = mongoose.model('registrocirugiaanestecia', registroCirugiaAnesteciaSchema);

//esquema para registro de partos
const registroPartosSchema = new mongoose.Schema({
	fecha: String,
	idPaciente: mongoose.Types.ObjectId,
	nombrePaciente: String,
	edad: Number,
	estadoCivil: String,
	procedencia: String,
	intruccion: String,
	ocupacion: String,
	fgFum: String,
	ago: String,
	hv_hmTipo: String,
	v_mTipo: String,
	parto: String,
	sexo: String,
	apgar: String,
	egCapurro: String,
	peso: Number,
	perimetroCefalico: String,
	perimetroBraquial: String,
	talla: Number,
	obstetra: mongoose.Types.ObjectId,
	nombreObstetra: String,
	pediatra: mongoose.Types.ObjectId,
	nombrePediatra: String,
	observacion: String,
	estado: Boolean
});

const RegistroPartos = mongoose.model('registropartos', registroPartosSchema);



const registroLogsSchema = new mongoose.Schema({
    fecha: String,
    usuario:String,
	accion: String,
    tabla:String,
    registro:String
});

const RegistroLogs = mongoose.model('registro_log', registroLogsSchema);



export {
	PersonalHospitalario,
	Paciente,
	Turno,
	Horario,
	AreaMedica,
	Subprocedimiento,
	Procedimiento,
	AgendaQuirofano,
	MedicoTratante,
	RegistroCirugiaAnestecia,
    RegistroPartos,
    RegistroLogs
};
