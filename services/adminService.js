import Admin from "../models/adminModel.js"

export const create = async (password, data) => {
    return await Admin.create({...data, password})
}

export const update = async (id, data) => {
    return await Admin.findByIdAndUpdate(id, data)
}


export const inspectAdmin = async (data) => {
    return await Admin.findOne({email: data})

}

export const getAdmin = async (id) => {
    return await Admin.findOne({_id: id})

}


export const remove = async (id) => {
    return await Admin.findByIdAndDelete(id)

}

