import mongoose from 'mongoose';
import { rejects } from 'assert';
import {
	PersonalHospitalario,
	Paciente,
	Turno,
	Horario,
	AreaMedica,
	Subprocedimiento,
	Procedimiento,
	AgendaQuirofano,
	MedicoTratante,
	RegistroPartos,
	RegistroCirugiaAnestecia,
	RegistroLogs
} from './db';
import bcrypt from 'bcrypt';
//Generar token
import dotenv from 'dotenv';
//dotenv.config({ path: 'variables.env' });
import jwt from 'jsonwebtoken';
import { resolve } from 'dns';

const crearToken = (usuarioLogin, secreto, expiresIn) => {
	const { usuario } = usuarioLogin;
	return jwt.sign({ usuario }, secreto, { expiresIn });
};

export const resolvers = {
	Query: {
		//Querys para personal Hospitalario-------------------------------------------------------------------------

		obtenerPersonalHospitalario: (root, args, { usuarioActual }) => {
			if (!usuarioActual) {
				return null;
			}

			const usuario = PersonalHospitalario.findOne({ usuario: usuarioActual.usuario, estado: true });
			return usuario;
		},

		obtenerTrabajadores: (root, { limite, offset, filtro }) => {
			return PersonalHospitalario.find({
				$and: [
					{ estado: true },
					{
						$or: [
							{ nombres: { $regex: filtro } },
							{ apellidos: { $regex: filtro } },
							{ rol: { $regex: filtro } },

							{ identificacion: { $regex: filtro } }
						]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		totalTrabajadores: (root) => {
			return new Promise((resolve, object) => {
				PersonalHospitalario.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		//obtener un personal dado el Id para posteriormente modificarlo o hacer cualquier accion-----------------

		obtenerPersonal: (root, { id }) => {
			return new Promise((resolve, object) => {
				PersonalHospitalario.findById(id, (error, personal) => {
					if (error) rejects(error);
					else resolve(personal);
				});
			});
		},
///------------------querys para registros logs
obtenerRegistroLogs: (root, { limite, offset, filtro }) => {
	return RegistroLogs.find({

				$or: [
					{ fecha: { $regex: filtro } },
					{ tabla: { $regex: filtro } },
					{ registro: { $regex: filtro } },
					{ accion: { $regex: filtro } }
			
		]
	})
		.limit(limite)
		.skip(offset)
		.sort({ _id: -1 });
},
totalLogs: (root) => {
	return new Promise((resolve, object) => {
		RegistroLogs.countDocuments((error, count) => {
			if (error) rejects(error);
			else resolve(count);
		});
	});
},
		/// querys para Medico Tratante--------------------------------------------------------------------------------------------

		obtenerMedicos: (root, { limite, offset, filtro }) => {
			return MedicoTratante.find({
				$and: [
					{ estado: true },
					{
						$or: [
							{ nombres: { $regex: filtro } },
							{ apellidos: { $regex: filtro } },

							{ identificacion: { $regex: filtro } }
						]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		totalMedicos: (root) => {
			return new Promise((resolve, object) => {
				MedicoTratante.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		obtenerMedico: (root, { id }) => {
			return new Promise((resolve, object) => {
				MedicoTratante.findById(id, (error, medico) => {
					if (error) rejects(error);
					else resolve(medico);
				});
			});
		},
		//Querys para paciente---------------------------------------------------------------------------------------------------------
		//obtener un paciente dado el Id
		obtenerPaciente: (root, { id }) => {
			return new Promise((resolve, object) => {
				Paciente.findById(id, (error, paciente) => {
					if (error) rejects(error);
					else resolve(paciente);
				});
			});
		},

		totalPacientes: (root) => {
			return new Promise((resolve, object) => {
				Paciente.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		obtenerPacientes: (root, { limite, offset, filtro }) => {
			return Paciente.find({
				$and: [
					{ estado: true },
					{
						$or: [
							{ nombres: { $regex: filtro } },
							{ apellidos: { $regex: filtro } },

							{ identificacion: { $regex: filtro } }
						]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		//querys para turnos-------------------------------------------------------------------------------------
		obtenerTurnos: (root, { limite, offset, filtro }) => {
			return Turno.find({
				$and: [
					{ estado: true },
					{
						$or: [ { abreviatura: { $regex: filtro } }, { descripcion: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		obtenerTurno: (root, { id }) => {
			return new Promise((resolve, object) => {
				Turno.findById(id, (error, turno) => {
					if (error) rejects(error);
					else resolve(turno);
				});
			});
		},

		totalTurnos: (root) => {
			return new Promise((resolve, object) => {
				Turno.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		//querya para horarios--------------------------------------------------------------------------------
		obtenerHorarios: (root, {}) => {
			return Horario.find({ estado: true }).sort({ _id: -1 });
		},
		totalHorarios: (root) => {
			return new Promise((resolve, object) => {
				Horario.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		obtenerHorariosByPersonal: (root, { limite, offset, mes, year, rol, filtro }) => {
			return Horario.find({
				$and: [
					{ estado: true },

					{ mes: mes },
					{ year: year },
					{ rolUsuario: rol },
					{
						$or: [ { nombrePersonal: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		obtenerHorariosById: (root, { limite, offset, mes, year, personal }) => {
			return Horario.find({
				$and: [ { estado: true }, { mes: mes }, { year: year }, { personal: personal } ]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		/*obtenerHorariosByPersonal: (root,{limite,offset,mes,year,rol}) => {
			return new Promise((resolve, object) => {
				Horario.aggregate(
					[
						{
							$match: { estado: true }
						},
                         
						{
							$match: { mes: mes }
						},
						{
							$match: { year: year }
						},
						{
							$match: { rolUsuario: rol }
						},
                         
						{
							$lookup: {
								from: 'personalhospitalarios',
								localField: 'personal',
								foreignField: '_id',
								as: 'personalHospitalario'
							}
						},	{ $skip : offset },
												{$limit:limite}
											
					
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		*/
		obtenerHorariosByPersonalH: (root, { mes, year, rol }) => {
			return new Promise((resolve, object) => {
				Horario.aggregate(
					[
						{
							$match: { estado: true }
						},
						{
							$match: { mes: mes }
						},
						{
							$match: { year: year }
						},

						{
							$match: { rolUsuario: rol }
						},
						{
							$lookup: {
								from: 'personalhospitalarios',
								localField: 'personal',
								foreignField: '_id',
								as: 'personalHospitalario'
							}
						}
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},

		obtenerAreasMedicas: (root, { limite, offset, filtro }) => {
			return AreaMedica.find({
				$and: [
					{ estado: true },
					{
						$or: [ { nombres: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},
		totalAreasMedicas: (root) => {
			return new Promise((resolve, object) => {
				AreaMedica.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		obtenerAreaMedica: (root, { id }) => {
			return new Promise((resolve, object) => {
				AreaMedica.findById(id, (error, areaMedica) => {
					if (error) rejects(error);
					else resolve(areaMedica);
				});
			});
		},
		//query para subprocedimiento-----------------------------------------------------------------------------------------------------------
		obtenerSubprocedimientos: (root, { limite, offset, filtro }) => {
			return Subprocedimiento.find({
				$and: [
					{ estado: true },
					{
						$or: [ { nombres: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},
		totalSubprocedimientos: (root) => {
			return new Promise((resolve, object) => {
				Subprocedimiento.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		obtenerSubprocedimiento: (root, { id }) => {
			return new Promise((resolve, object) => {
				Subprocedimiento.findById(id, (error, subprocedimiento) => {
					if (error) rejects(error);
					else resolve(subprocedimiento);
				});
			});
		},

		obtenerProcedimientos: (root, { limite, offset, filtro }) => {
			return Procedimiento.find({
				$and: [
					{ estado: true },
					{
						$or: [ { nombres: { $regex: filtro } }, { codigo: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},
		totalProcedimientos: (root) => {
			return new Promise((resolve, object) => {
				Procedimiento.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},

		obtenerProcedimiento: (root, { id }) => {
			return new Promise((resolve, object) => {
				Procedimiento.findById(id, (error, procedimiento) => {
					if (error) rejects(error);
					else resolve(procedimiento);
				});
			});
		},

		//querys para agendaQuirofano------------------------------------------------------------------------------

		obtenerAgendaQuirofanos: (root, { limite, offset, filtro }) => {
			return AgendaQuirofano.find({
				$and: [
					{ cancelado: false },
					{
						$or: [ { fecha: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: 1 });
		},
		totalQuirofanos: (root) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.countDocuments((error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		obtenerAgendaQuirofanosAll: (root, { limite, offset, filtro, filtroM }) => {
			return AgendaQuirofano.find({
				$and: [ { quirofano: { $regex: filtroM } }, { fecha: { $regex: filtro } } ]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},

		obtenerAgendaKitSolicitado: (root, { limite, offset, filtro }) => {
			return AgendaQuirofano.find({
				$and: [
					{ cancelado: false },
					{ kitSolicitado: true },
					{
						$or: [ { medico: { $regex: filtro } }, { fecha: { $regex: filtro } } ]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},
		obtenerAgendaQuirofano: (root, { id }) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.findById(id, (error, agendaQuirofano) => {
					if (error) rejects(error);
					else resolve(agendaQuirofano);
				});
			});
		},

		//querys para registroanestecia
		obtenerRegistrosCirugias: (root, { limite, offset, filtro }) => {
			return RegistroCirugiaAnestecia.find({
				$and: [
					{ estado: true },
					{
						$or: [
							{ nombreMedico: { $regex: filtro } },
							{ nombrePaciente: { $regex: filtro } },
							{ nombreQuirofano: { $regex: filtro } },
							{ fechaOperacion: { $regex: filtro } }
						]
					}
				]
			})
				.limit(limite)
				.skip(offset)
				.sort({ _id: -1 });
		},
		totalRegistroCirugia: (root) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		obtenerRegistroCirugia: (root, { id }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.findById(id, (error, registroanestecia) => {
					if (error) rejects(error);
					else resolve(registroanestecia);
				});
			});
		},

		//querys para registro partos
		obtenerRegistrosPartos: (root, { limite, offset, filtro }) => {
			return RegistroPartos.find({
				$and: [
					{ estado: true },
					{
						$or: [
							{ nombreObstetra: { $regex: filtro } },
							{ nombrePaciente: { $regex: filtro } },
							{ nombrePediatra: { $regex: filtro } },
							{ fecha: { $regex: filtro } }
						]
					}
				]
			}).limit(limite)
			.skip(offset)
			.sort({ _id: -1 });
		},
		totalPartos: (root) => {
			return new Promise((resolve, object) => {
				RegistroPartos.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},
		obtenerRegistroParto: (root, { id }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.findById(id, (error, registroPartos) => {
					if (error) rejects(error);
					else resolve(registroPartos);
				});
			});
		},
		///panel de cirugias consultas para barras estadisticas
		///mas realizadas
		topCirugias: (root, { limit, fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.aggregate(
					[
						{
							$match: {
								fechaOperacion: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$group: {
								_id: '$idOperacionRealizada',
								total: { $sum: 1 }
							}
						},
						{
							$lookup: {
								from: 'procedimientos',
								localField: '_id',
								foreignField: '_id',
								as: 'operacion'
							}
						},
						{ $sort: { total: -1 } },
						{ $limit: limit }
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		///menos realizadas

		topCirugiasM: (root, { limit, fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.aggregate(
					[
						{
							$match: {
								fechaOperacion: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$group: {
								_id: '$idOperacionRealizada',
								total: { $sum: 1 }
							}
						},
						{
							$lookup: {
								from: 'procedimientos',
								localField: '_id',
								foreignField: '_id',
								as: 'operacion'
							}
						},
						{ $sort: { total: 1 } },
						{ $limit: limit }
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		//top medicos

		topMedicos: (root, { limit, fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.aggregate(
					[
						{
							$match: {
								fechaOperacion: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$group: {
								_id: '$idMedico',
								total: { $sum: 1 }
							}
						},
						{
							$lookup: {
								from: 'personalhospitalarios',
								localField: '_id',
								foreignField: '_id',
								as: 'medico'
							}
						},
						{ $sort: { total: -1 } },
						{ $limit: limit }
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		topMedicosM: (root, { limit, fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.aggregate(
					[
						{
							$match: {
								fechaOperacion: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$group: {
								_id: '$idMedico',
								total: { $sum: 1 }
							}
						},
						{
							$lookup: {
								from: 'personalhospitalarios',
								localField: '_id',
								foreignField: '_id',
								as: 'medico'
							}
						},
						{ $sort: { total: 1 } },
						{ $limit: limit }
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		//------------------------------------Panel de partos
		porcentajeNacidos: (root, { fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.aggregate(
					[
						{
							$match: {
								fecha: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$group: {
								_id:  '$v_mTipo' ,
								total: { $sum: 1 }
							}
						},
						
						{ $sort: { total: -1 } },
						
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},

		porcentajeSexo: (root, { fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.aggregate(
					[
						{
							$match: {
								fecha: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$match: {
								v_mTipo: "v"
							}
						},
						{
							$group: {
								_id:  '$sexo' ,
								total: { $sum: 1 }
							}
						},
						
						{ $sort: { total: -1 } },
						
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		porcentajeMujeresHombresMuertos: (root, { fromDate, toDate }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.aggregate(
					[
						{
							$match: {
								fecha: {
									$gte: fromDate,
									$lte: toDate
								}
							}
						},
						{
							$match: {
								estado: true
							}
						},
						{
							$match: {
								v_mTipo: "m"
							}
						},
						{
							$group: {
								_id:  '$sexo' ,
								total: { $sum: 1 }
							}
						},
						
						{ $sort: { total: -1 } },
						
					],
					(error, resultado) => {
						if (error) rejects(error);
						else resolve(resultado);
					}
				);
			});
		},
		totalNacidos: (root) => {
			return new Promise((resolve, object) => {
				RegistroPartos.countDocuments({ estado: true }, (error, count) => {
					if (error) rejects(error);
					else resolve(count);
				});
			});
		},







	},
	
	Mutation: {
		//mutation para Personal Hospitalario------------------------------------------------------------------------------------------------
		crearPersonalHospitalario: async (root, { input }) => {
			const nuevoPersonalHospitalario = new PersonalHospitalario({
				nombres: input.nombres,
				apellidos: input.apellidos,
				identificacion: input.identificacion,
				emails: input.emails,
				direcciones: input.direcciones,
				rol: input.rol,
				fechaNacimiento: input.fechaNacimiento,
				usuario: input.usuario,
				password: input.password,
				telefonos: input.telefonos,
				imagen: input.imagen,

				tipoSangre: input.tipoSangre,
				nombreContacto: input.nombreContacto,
				telefonoContacto: input.telefonoContacto,
				tipoIdentificacion: input.tipoIdentificacion,
				fechaIngreso: input.fechaIngreso,

				especialidad: input.especialidad,
				gestionHorarios: input.gestionHorarios,
				estado: true
			});
			const usuario = nuevoPersonalHospitalario.usuario;
			const identificacion = nuevoPersonalHospitalario.identificacion;
			const existeCedula = await PersonalHospitalario.findOne({ identificacion });
			if (existeCedula) {
				throw new Error('El usuario con la identificacion ingresada ya existe');
			}
			const existePersonal = await PersonalHospitalario.findOne({ usuario });
			if (existePersonal) {
				throw new Error('El usuario ya existe');
			}

			nuevoPersonalHospitalario.id = nuevoPersonalHospitalario._id;
			return new Promise((resolve, object) => {
				nuevoPersonalHospitalario.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoPersonalHospitalario);
				});
			});
		},

		autenticarPersonal: async (root, { usuario, password }) => {
			const nombreUsuario = await PersonalHospitalario.findOne({ usuario, estado: true });
			if (!nombreUsuario) {
				throw new Error('Usuario no encontrado');
			}
			const passwordCorrecto = await bcrypt.compare(password, nombreUsuario.password);
			//si el password es incorrecto
			if (!passwordCorrecto) {
				throw new Error('Password Inconrrecto');
			}
			return {
				token: crearToken(nombreUsuario, process.env.SECRETO, '2hr')
			};
		},

		actualizarPassword: async (root, { id, usuario, password, passwordAnterior }) => {
			const nombreUsuario = await PersonalHospitalario.findOne({ usuario, estado: true });
			if (!nombreUsuario) {
				throw new Error('Usuario no encontrado');
			}
			const passwordCorrecto = await bcrypt.compare(passwordAnterior, nombreUsuario.password);
			//si el password es incorrecto
			if (!passwordCorrecto) {
				throw new Error('Password anterior incorrecto');
			}
			const salt = bcrypt.genSaltSync(10);
			const hash = bcrypt.hashSync(password, salt);
			const passwordHash = hash;
			return new Promise((resolve, object) => {
				PersonalHospitalario.findOneAndUpdate({ _id: id }, { password: passwordHash }, (error) => {
					if (error) rejects(error);
					else resolve('Contraseña actualizada');
				});
			});
		},

		actualizarPersonal: (root, { input }) => {
			return new Promise((resolve, object) => {
				PersonalHospitalario.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, personal) => {
					if (error) rejects(error);
					else resolve(personal);
				});
			});
		},

		eliminarPersonal: (root, { id }) => {
			return new Promise((resolve, object) => {
				PersonalHospitalario.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},
		//Mutation para medico Tratante----------------------------------------------------------------------------------------------------

		crearMedicoTratante: async (root, { input }) => {
			const nuevoMedicoTratante = new MedicoTratante({
				nombres: input.nombres,
				apellidos: input.apellidos,
				identificacion: input.identificacion,
				fechaNacimiento: input.fechaNacimiento,
				imagen: input.imagen,
				telefonos: input.telefonos,
				emails: input.emails,
				direcciones: input.direcciones,
				nombreContacto: input.nombreContacto,
				telefonoContacto: input.telefonoContacto,
				tipoSangre: input.tipoSangre,
				fechaIngreso: input.fechaIngreso,
				tipoIdentificacion: input.tipoIdentificacion,
				especialidad: input.especialidad,
				estado: true
			});

			const identificacion = nuevoMedicoTratante.identificacion;
			const existeIdentificacion = await MedicoTratante.findOne({ identificacion });
			if (existeIdentificacion) {
				throw new Error('El usuario con la identificacion ingresada ya existe');
			}

			nuevoMedicoTratante.id = nuevoMedicoTratante._id;
			return new Promise((resolve, object) => {
				nuevoMedicoTratante.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoMedicoTratante);
				});
			});
		},

		actualizarMedicoTratante: (root, { input }) => {
			return new Promise((resolve, object) => {
				MedicoTratante.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, medico) => {
					if (error) rejects(error);
					else resolve(medico);
				});
			});
		},

		eliminarMedicoTratante: (root, { id }) => {
			return new Promise((resolve, object) => {
				MedicoTratante.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		//Mutation para Paciente--------------------------------------------------------------------------------------------

		crearPaciente: async (root, { input }) => {
			const nuevoPaciente = new Paciente({
				nombres: input.nombres,
				apellidos: input.apellidos,
				identificacion: input.identificacion,
				fechaNacimiento: input.fechaNacimiento,
				sexo: input.sexo,
				peso: input.peso,
				talla: input.talla,
				estadoCivil: input.estadoCivil,
				procedencia: input.procedencia,
				ocupacion: input.ocupacion,
				estado: true,
				imagen: input.imagen,
				telefonos: input.telefonos,
				emails: input.emails,
				direcciones: input.direcciones,
				tipoSangre: input.tipoSangre,
				nombreContacto: input.nombreContacto,
				telefonoContacto: input.telefonoContacto,
				tipoIdentificacion: input.tipoIdentificacion
			});
			const identificacion = nuevoPaciente.identificacion;
			const existePaciente = await Paciente.findOne({ identificacion });
			if (existePaciente) {
				throw new Error('El paciente con la identificacion ingresada ya existe');
			}
			nuevoPaciente.id = nuevoPaciente._id;
			return new Promise((resolve, object) => {
				nuevoPaciente.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoPaciente);
				});
			});
		},

		actualizarPaciente: (root, { input }) => {
			return new Promise((resolve, object) => {
				Paciente.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, paciente) => {
					if (error) rejects(error);
					else resolve(paciente);
				});
			});
		},

		eliminarPaciente: (root, { id }) => {
			return new Promise((resolve, object) => {
				Paciente.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},
//---------mutation para crear registro logs
crearRegistroLogs: (root, { input }) => {
	const nuevoLog = new RegistroLogs({
		fecha: input.fecha,
		usuario:input.usuario,
	accion: input.accion,
    tabla:input.tabla,
    registro:input.registro
	});
	nuevoLog.id = nuevoLog._id;
	return new Promise((resolve, object) => {
		nuevoLog.save((error) => {
			if (error) rejects(error);
			else resolve(nuevoLog);
		});
	});
},
		//mutation para turnos------------------------------------------------------------------------------------------------------
		crearTurno: (root, { input }) => {
			const nuevoTurno = new Turno({
				abreviatura: input.abreviatura,
				descripcion: input.descripcion,
				horaEntrada: input.horaEntrada,
				horaSalida: input.horaSalida,
				totalHoras: input.totalHoras,
				colorIdentificacion: input.colorIdentificacion,
				estado: true
			});
			nuevoTurno.id = nuevoTurno._id;
			return new Promise((resolve, object) => {
				nuevoTurno.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoTurno);
				});
			});
		},

		eliminarTurno: (root, { id }) => {
			return new Promise((resolve, object) => {
				Turno.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		actualizarTurno: (root, { input }) => {
			return new Promise((resolve, object) => {
				Turno.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, turno) => {
					if (error) rejects(error);
					else resolve(turno);
				});
			});
		},
		//mutation para crear horarios-------------------------------------------------------------------------------------------------------------
		crearHorario: (root, { input }) => {
			const nuevoHorario = new Horario({
				personal: input.personal,
				nombrePersonal: input.nombrePersonal,
				rolUsuario: input.rolUsuario,
				fechaCreacion: input.fechaCreacion,
				mes: input.mes,
				year: input.year,
				diasTrabajo: input.diasTrabajo,
				totalHoras: input.totalHoras,
				estado: true
			});
			nuevoHorario.id = nuevoHorario._id;
			return new Promise((resolve, object) => {
				nuevoHorario.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoHorario);
				});
			});
		},

		actualizarHorario: (root, { input }) => {
			return new Promise((resolve, object) => {
				Horario.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, turno) => {
					if (error) rejects(error);
					else resolve(turno);
				});
			});
		},

		eliminarHorario: (root, { id }) => {
			return new Promise((resolve, object) => {
				Horario.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		//mutation para la areamedica--------------------------------------------------------------------------------------------------------------------

		crearAreaMedica: async (root, { input }) => {
			const nuevoAreaMedica = new AreaMedica({
				nombres: input.nombres,
				descripcion: input.descripcion,
				ubicacion: input.ubicacion,
				estado: true
			});
			const nombres = nuevoAreaMedica.nombres;
			const existeNombre = await AreaMedica.findOne({ nombres });
			if (existeNombre) {
				throw new Error('El area medica con el nombre ingresado ya existe');
			}
			nuevoAreaMedica.id = nuevoAreaMedica._id;
			return new Promise((resolve, object) => {
				nuevoAreaMedica.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoAreaMedica);
				});
			});
		},

		eliminarAreaMedica: (root, { id }) => {
			return new Promise((resolve, object) => {
				AreaMedica.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		actualizarAreaMedica: (root, { input }) => {
			return new Promise((resolve, object) => {
				AreaMedica.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, areaMedica) => {
					if (error) rejects(error);
					else resolve(areaMedica);
				});
			});
		},

		//mutation para subprocedimiento-----------------------------------------------------------------------------------------------------
		crearSubprocedimiento: async (root, { input }) => {
			const nuevoSubprocedimiento = new Subprocedimiento({
				nombres: input.nombres,
				descripcion: input.descripcion,
				valorTotal: input.valorTotal,
				estado: true
			});
			const nombres = nuevoSubprocedimiento.nombres;
			const existeNombre = await Subprocedimiento.findOne({ nombres });
			if (existeNombre) {
				throw new Error('El subprocedimiento con el nombre ingresado ya existe');
			}
			nuevoSubprocedimiento.id = nuevoSubprocedimiento._id;
			return new Promise((resolve, object) => {
				nuevoSubprocedimiento.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoSubprocedimiento);
				});
			});
		},

		eliminarSubprocedimiento: (root, { id }) => {
			return new Promise((resolve, object) => {
				Subprocedimiento.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		actualizarSubprocedimiento: (root, { input }) => {
			return new Promise((resolve, object) => {
				Subprocedimiento.findOneAndUpdate(
					{ _id: input.id },
					input,
					{ new: true },
					(error, subprocedimiento) => {
						if (error) rejects(error);
						else resolve(subprocedimiento);
					}
				);
			});
		},

		///mutation para procedimiento----------------------------------------------------------------------------------------------------------

		crearProcedimiento: async (root, { input }) => {
			const nuevoProcedimiento = new Procedimiento({
				nombres: input.nombres,
				descripcion: input.descripcion,
				codigo: input.codigo,
				valorTotal: input.valorTotal,
				subprocedimiento: input.subprocedimiento,
				estado: true
			});
			const nombres = nuevoProcedimiento.nombres;
			const existeNombre = await Procedimiento.findOne({ nombres });
			if (existeNombre) {
				throw new Error('El subprocedimiento con el nombre ingresado ya existe');
			}
			nuevoProcedimiento.id = nuevoProcedimiento._id;
			return new Promise((resolve, object) => {
				nuevoProcedimiento.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoProcedimiento);
				});
			});
		},

		eliminarProcedimiento: (root, { id }) => {
			return new Promise((resolve, object) => {
				Procedimiento.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino correctamente');
				});
			});
		},

		actualizarProcedimiento: (root, { input }) => {
			return new Promise((resolve, object) => {
				Procedimiento.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, procedimiento) => {
					if (error) rejects(error);
					else resolve(procedimiento);
				});
			});
		},

		//mutation para agenda Quirofano -------------------------------------------------------------------------------
		crearAgendaQuirofano: (root, { input }) => {
			const nuevoAgendaQuirofano = new AgendaQuirofano({
				medico: input.medico,
				quirofano: input.quirofano,
				fecha: input.fecha,
				horaEntrada: input.horaEntrada,
				horaSalida: input.horaSalida,
				paciente: input.paciente,
				diagnostico: input.diagnostico,
				procedimiento: input.procedimiento,
				cancelado: false,
				enfermera: input.enfermera,
				auxiliar: input.auxiliar,
				valor: input.valor,
				kitSolicitado: false,
				kitDespachado: false,
				importado: false
			});
			nuevoAgendaQuirofano.id = nuevoAgendaQuirofano._id;
			return new Promise((resolve, object) => {
				nuevoAgendaQuirofano.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoAgendaQuirofano);
				});
			});
		},

		eliminarAgendaQuirofano: (root, { id }) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.findOneAndUpdate({ _id: id }, { cancelado: true }, (error) => {
					if (error) rejects(error);
					else resolve('Se canceló  correctamente');
				});
			});
		},

		actualizarAgendaKitSolicitado: (root, { id }) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.findOneAndUpdate({ _id: id }, { kitSolicitado: true }, (error) => {
					if (error) rejects(error);
					else resolve('Se ha realizado la solicitud del kit Quirurgico');
				});
			});
		},

		actualizarAgendaImportado: (root, { id }) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.findOneAndUpdate({ _id: id }, { importado: true }, (error) => {
					if (error) rejects(error);
					else resolve('Se ha realizado la solicitud del kit Quirurgico');
				});
			});
		},
		actualizarAgendaKitDespachado: (root, { id }) => {
			return new Promise((resolve, object) => {
				AgendaQuirofano.findOneAndUpdate({ _id: id }, { kitDespachado: true }, (error) => {
					if (error) rejects(error);
					else resolve('La entrega del kit quirurgico se realizo correctamente');
				});
			});
		},

		//mutation para registro anestecia--------------------------------------------------------------------------------
		crearRegistroCirugia: (root, { input }) => {
			const nuevoRegistroCirugia = new RegistroCirugiaAnestecia({
				idMedico: input.idMedico,
				nombreMedico: input.nombreMedico,
				idQuirofano: input.idQuirofano,
				nombreQuirofano: input.nombreQuirofano,
				fechaOperacion: input.fechaOperacion,
				idPaciente: input.idPaciente,
				nombrePaciente: input.nombrePaciente,
				edad: input.edad,
				sexo: input.sexo,
				peso: input.peso,
				talla: input.talla,
				idOperacionRealizada: input.idOperacionRealizada,
				nombreOperacion: input.nombreOperacion,
				diagnosticoPreoperatorio: input.diagnosticoPreoperatorio,
				riesgo: input.riesgo,
				anestecia: input.anestecia,
				recuperacionAldrette: input.recuperacionAldrette,
				observacion: input.observacion,
				servicio: input.servicio,
				idCirujano: input.idCirujano,
				nombreCirujano: input.nombreCirujano,
				idAyudante: input.idAyudante,
				nombreAyudante: input.nombreAyudante,
				idAnestesista: input.idAnestesista,
				nombreAnestesista: input.nombreAnestesista,
				idIntrumentista: input.idIntrumentista,
				nombreIntrumentista: input.nombreIntrumentista,
				idCirculante: input.idCirculante,
				nombreCirculante: input.nombreCirculante,
				emergencia: input.emergencia,

				estado: true
			});
			nuevoRegistroCirugia.id = nuevoRegistroCirugia._id;
			return new Promise((resolve, object) => {
				nuevoRegistroCirugia.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoRegistroCirugia);
				});
			});
		},

		eliminarRegistroCirugia: (root, { id }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se canceló  correctamente');
				});
			});
		},

		actualizarRegistroCirugia: (root, { input }) => {
			return new Promise((resolve, object) => {
				RegistroCirugiaAnestecia.findOneAndUpdate(
					{ _id: input.id },
					input,
					{ new: true },
					(error, registroCirugia) => {
						if (error) rejects(error);
						else resolve(registroCirugia);
					}
				);
			});
		},

		////mutation para registro partos-------------------------------------------------------------------
		crearRegistroParto: (root, { input }) => {
			const nuevoRegistroParto = new RegistroPartos({
				fecha: input.fecha,
				idPaciente: input.idPaciente,
				nombrePaciente: input.nombrePaciente,
				edad: input.edad,
				estadoCivil: input.estadoCivil,
				procedencia: input.procedencia,
				intruccion: input.intruccion,
				ocupacion: input.ocupacion,
				fgFum: input.fgFum,
				ago: input.ago,
				hv_hmTipo: input.hv_hmTipo,
				v_mTipo: input.v_mTipo,
				parto: input.parto,
				sexo: input.sexo,
				apgar: input.apgar,
				egCapurro: input.egCapurro,
				peso: input.peso,
				perimetroCefalico: input.perimetroCefalico,
				perimetroBraquial: input.perimetroBraquial,
				talla: input.talla,
				obstetra: input.obstetra,
				nombreObstetra: input.nombreObstetra,
				pediatra: input.pediatra,
				nombrePediatra: input.nombrePediatra,
				observacion: input.observacion,
				estado: true
			});
			nuevoRegistroParto.id = nuevoRegistroParto._id;
			return new Promise((resolve, object) => {
				nuevoRegistroParto.save((error) => {
					if (error) rejects(error);
					else resolve(nuevoRegistroParto);
				});
			});
		},

		eliminarRegistroParto: (root, { id }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.findOneAndUpdate({ _id: id }, { estado: false }, (error) => {
					if (error) rejects(error);
					else resolve('Se elimino  correctamente');
				});
			});
		},

		actualizarRegistroParto: (root, { input }) => {
			return new Promise((resolve, object) => {
				RegistroPartos.findOneAndUpdate({ _id: input.id }, input, { new: true }, (error, registroParto) => {
					if (error) rejects(error);
					else resolve(registroParto);
				});
			});
		}
	}
};

export default resolvers;
