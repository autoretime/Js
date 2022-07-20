class Storage{
    static set(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }
    static get(key){
        return JSON.parse(localStorage.getItem(key)) 
    }
}

class Cart{
    static #products = Storage.get('cart') ?? [];

    static getProducts(){
        return this.#products;
    }

    static add(product){
        let[isset] = this.#products.filter(p => p.id === product.id)
        if(isset){
            isset.qty += product.qty
        }else{
            this.#products.push(product)
        }
        Storage.set('cart', this.#products)

    }
    static clear(){
        this.#products = []
        Storage.set('cart', this.#products)
    }

    static remove(id){
        this.#products.forEach((product, index) => product.id === id ? this.#products.splice(index, 1) : null)
        Storage.set('cart', this.#products)
    }

    static change(id, qty){
        let[isset] = this.#products.filter(p => id === p.id)
        if(isset){
            isset.qty = qty
        }
        Storage.set('cart', this.#products)
    }
    
    static getTotalPrice(){
        return this.#products.reduce((sum, product) => sum + product.price * product.qty, 0)
    }

}




const trash = document.querySelector('.trash')


window.addEventListener('click', function (e) {  
    let counter;

    if(e.target.dataset.action === 'plus' || e.target.dataset.action === 'minus'){
        
        const counterwrapper = e.target.closest('.counter-wrapper')
        counter = counterwrapper.querySelector('[data-counter]')

    }     
    if(e.target.dataset.action === 'plus'){    

        counter.innerText = ++counter.innerText;  

    }
    if(e.target.dataset.action === 'minus'){
        
        if( parseInt(counter.innerText) > 1 ){
            counter.innerText = --counter.innerText;
        } 
    }

    if(e.target.hasAttribute('data-action')){
        calcCartPrice()
        Cart.change(e.target.getAttribute('data-id'), counter.innerText)
    }
})


window.addEventListener('click', modify )

function modify (e) {

    let cartItemHTML;
    let productInfo;

    if(e.target.hasAttribute('data-cart')){

        const cart = e.target.closest('.cart')
        
        productInfo = {
            id: cart.dataset.id,
            title: cart.querySelector('.item-title').innerText,
            price: cart.querySelector('.price').innerText,
            qty: 1
        }

        const itemInCart = trash.querySelector(`[data-id="${productInfo.id}"]`)
        if(itemInCart){
            alert('Change the product already in the cart, just change the quantity')
            return
        }else{
            cartItemHTML = `
                <div class=" delbtn">
                    <hr>            
                    <div class="points d-f">
                        <div class="id-name">${productInfo.id}</div>
                        <div class="name">${productInfo.title}</div>
                        <div class="items items--small counter-wrapper d-f">
                            <div class="items__control" data-action="minus" data-id="${productInfo.id}">-</div>
                            <div class="items__current" data-counter="">1</div>
                            <div class="items__control" data-action="plus" data-id="${productInfo.id}">+</div>
                        </div>
                        <div class="price__currency d-f">${productInfo.price}</div>
                        <div class="btn">
                            <button data-btn="${productInfo.id}">Delete</button>
                        </div>
                    </div>
                </div>`
            trash.insertAdjacentHTML('beforeEnd', cartItemHTML )
        }
       
        
        

       
        toggleCartStatus()
        calcCartPrice()
        Cart.add(productInfo)
        
        
         
    }

    if(e.target.hasAttribute('data-btn')){
        e.target.closest('.delbtn').remove()
        toggleCartStatus();
        calcCartPrice();
        Cart.remove(e.target.getAttribute('data-btn'));
    }

    let modal = document.getElementById('myModal');

    if(e.target.hasAttribute('data-button')){
        modal.style.display = 'block';
    }else if(e.target.hasAttribute('data-span')){
        modal.style.display = 'none';
    }
    if (e.target == modal) {
        modal.style.display = 'none';
    } 


    let firstEl = this.document.querySelector('.mySlides-first')
    let secondEl = this.document.querySelector('.mySlides-second')
    let thirdEl = this.document.querySelector('.mySlides-third')

    if(e.target.hasAttribute('data-next-one')){
        firstEl.style.display = 'none';
        secondEl.style.display = 'block'
    }else if(e.target.hasAttribute('data-prev-one')){
        secondEl.style.display = 'none'
        firstEl.style.display = 'block';
    }else if(e.target.hasAttribute('data-next-two')){
        secondEl.style.display = 'none';
        thirdEl.style.display = 'block'
    }else if(e.target.hasAttribute('data-prev-two')){
        thirdEl.style.display = 'none'
        secondEl.style.display = 'block'
    }
    
}





function toggleCartStatus(){
    const trashWrapper = document.querySelector('.trash')
    const cartEmpty = document.querySelector('[data-cart-empty]')

    if(trashWrapper.children.length > 2){
        cartEmpty.style.display = 'none'
        document.getElementById('addCart').disabled = false;
    }else{
        cartEmpty.style.display = 'block';
        document.getElementById('addCart').disabled = true;
    }

}

function calcCartPrice(){
    const cartItems = document.querySelectorAll('.points')
    const totalEl = document.querySelector('.tottal-price')


    let totalPrice = 0;
   
    cartItems.forEach(function(item){
        const amountEl = item.querySelector('[data-counter]')
        const priceEl = item.querySelector('.price__currency')
        const currentPrice = parseInt(amountEl.innerText) * parseInt(priceEl.innerText)
        totalPrice += currentPrice
    })

    totalEl.innerText = totalPrice
}


Cart.getProducts().forEach(productInfo => {
    cartItemHTML = `
                            <div class=" delbtn">
                                <hr>            
                                <div class="points d-f">
                                    <div class="id-name">${productInfo.id}</div>
                                    <div class="name">${productInfo.title}</div>
                                    <div class="items items--small counter-wrapper d-f">
                                        <div class="items__control" data-action="minus" data-id="${productInfo.id}">-</div>
                                        <div class="items__current" data-counter="">${productInfo.qty}</div>
                                        <div class="items__control" data-action="plus" data-id="${productInfo.id}">+</div>
                                    </div>
                                    <div class="price__currency d-f">${productInfo.price}</div>
                                    <div class="btn">
                                        <button data-btn="${productInfo.id}">Delete</button>
                                    </div>
                                </div>
                            </div>
                                
                        `
        trash.insertAdjacentHTML('beforeEnd', cartItemHTML )
        toggleCartStatus()
        calcCartPrice()
})


  const sendData = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });
  
    if (!response.ok) {
      throw new Error(`Ошибка по адресу ${url}, статус ошибки ${response.status}`);
    }
  
    return await response.json();
  }

//   const sendCart = () =>{
    let cartForm = document.querySelector('.modal form')
    cartForm.addEventListener('submit', (e)=>{
        e.preventDefault();
        const formData = new FormData(cartForm);

        formData.append('cart', JSON.stringify(Cart.getProducts()))
        console.log(formData);
        sendData('http://sweetondale.zp.ua/cart/new-order/', formData)
            .then(() => {
                cartForm.reset();
                Cart.clear();
                document.querySelector('.modal').style.display='none'
                window.location.reload()                
            })
            .catch((err) =>{
                console.log(err);
            })


    })

// }


