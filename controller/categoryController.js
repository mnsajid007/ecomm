const category = require("../model/category");
const slugify = require('slugify');

exports.createCategoryCon = async(req, res)=>{
    try {
        const {name} = req.body;

        if(!name){
            return res.status(300).send({
                success: false,
                message: 'category name is required'
            })
        }

        const check = await category.findOne({name});
            if(check){
                return res.status(301).send({
                    success: false,
                    message: 'unique category name is required'
                }) 
            }
            const createCate = new category({name, slug: slugify(name)});
            await createCate.save();

            return res.status(200).send({
                success: true,
                message: 'new category is created',
                createCate
            }) 

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in category callback'
        })
    }
}

exports.updateCategory = async(req, res)=>{
    try {
        const {name} = req.body;
        const {id} = req.params;

        const updateCat = await category.findByIdAndUpdate(id, {name, slug:slugify(name)}, {new: true});
        if(!updateCat){
            return res.status(301).send({
                success: false,
                message: 'category id or category not exist'
            }) 
        }

        return res.status(201).send({
            success: true,
            message: 'category updated',
            updateCat
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in category callback'
        })
    }
}

exports.deleteCategory = async(req, res)=>{
    try {
        const {id} = req.params;
        if(!id){
            return res.status(400).send({
                success: false,
                message: 'id require'
            })
        }

        const del = await category.findByIdAndDelete(id);
        if(!del){
            return res.status(400).send({
                success: false,
                message: 'invalid category id'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'category is deleted',
            del
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in category callback'
        })
    }
}

exports.getAllCategory = async(req, res)=> {
    try {
        const getall = await category.find();
        if(!getall){
            return res.status(400).send({
                success: false,
                message: 'caregory get all error'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'all category',
            getall
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in category callback'
        })
    }
}

exports.singleCategory = async(req, res)=> {
    try {
        const getSingle = await category.findOne({slug:req.params.slug});
        if(!getSingle){
            return res.status(400).send({
                success: false,
                message: 'no single category found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'single category',
            getSingle
        }) 
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'error in category callback'
        })
    }
}