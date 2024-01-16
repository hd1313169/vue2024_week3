let productModal = null;
let delProductModal = null;

const app = Vue.createApp({
    //資料
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'ryanchiang13',
            products: [],
            isNew: false,
            tempProduct: {
                imagesUrl: [],
            },
        }
    },
    //方法
    methods: {
        //檢查權限
        checkAdmin() {
            const url = `${this.apiUrl}/api/user/check`;
            axios.post(url)
                .then(res => {
                    this.getData();
                })
                .catch(err => {
                    alert(err.response.data.message);
                    window.location = 'login-1st.html';
                })
        },
        //撈資料
        getData() {
            const url = `${this.apiUrl}/api/${this.apiPath}/admin/products/all`;
            axios.get(url)
                .then(res => {
                    this.products = res.data.products;
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        //打開彈跳視窗
        openModal(isNew, item) {
            if (isNew === 'new') {
                this.tempProduct = {
                    imagesUrl: [],
                };
                this.isNew = true;
                productModal.show();
            } else if (isNew === 'edit') {
                this.tempProduct = { ...item };
                this.isNew = false;
                productModal.show();
            } else if (isNew === 'delete') {
                this.tempProduct = { ...item };
                delProductModal.show();
            }
        },
        //更新產品
        updateProduct() {
            let url = `${this.apiUrl}/api/${this.apiPath}/admin/product`;
            let http = 'post';

            if (!this.isNew) {
                url = `${this.apiUrl}/api/${this.apiPath}/admin/product/${this.tempProduct.id}`;
                http = 'put';
            }
            axios[http](url, { data: this.tempProduct })
                .then(res => {
                    alert(res.data.message);
                    productModal.hide();
                    this.getData();
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        //刪除產品
        delProduct() {
            const url = `${this.apiUrl}/api/ryanchiang13/admin/product/${this.tempProduct.id}`;

            axios.delete(url)
                .then(res => {
                    alert(res.data.message);
                    delProductModal.hide();
                    this.getData();
                })
                .catch(err => {
                    alert(err.response.data.message);
                })
        },
        //新增圖片
        createImages() {
            this.tempProduct.imagesUrl = [];
            this.tempProduct.imagesUrl.push('');
        }
    },
    mounted() {
        //彈出視窗
        productModal = new bootstrap.Modal(document.getElementById('productModal'), { keyboard: false });
        delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), { keyboard: false });

        // 取出 Token
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
        axios.defaults.headers.common.Authorization = token;

        this.checkAdmin();
    }
});

app.mount('#app');