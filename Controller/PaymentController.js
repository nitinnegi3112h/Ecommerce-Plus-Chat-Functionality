import Stripe from "stripe";

const stripe=new Stripe(process.env.STRIPE_KEY);

export const createCustomer=async(req,res)=>
{
    try {
        
        const customer=await stripe.customers.create({
            name:req.body.name,
            email:req.body.email,
        });

        res.status(201).json({
            customer
        })

    } catch (error) {
        res.status(401).json({
            message:"Customer Creation failed",
        })
    }
}


export const addCard=async(req,res)=>
{
    try {

        const {customer_id,
               card_Name,
               card_ExpYear,
               card_ExpMonth,
               card_Number,
               card_CVC,
        }=req.body;

        const card_token=await stripe.tokens.create({
            card:{
                 name:card_Name,
                  number:card_Number,
                  exp_year:card_ExpYear,
                  exp_month:card_ExpMonth,
                  cvc:card_CVC
            }
        });

        

        const card=await stripe.customers.createSource(customer_id,{
            source:`${card_token.id}`
        });

       

        res.status(201).json({
            card:card.id
        });
        
    } catch (error) {
        
        console.log(error)
        res.status(401).json({
            message:"Failed To add Card...."
        })
    }
}