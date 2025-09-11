const { createApp } = Vue;

createApp({
    data() {
        return {
            // 表单数据
            password: '',
            username: '',
            email: '',
            
            // 验证状态
            passwordValid: false,
            usernameValid: false,
            emailValid: false,
            
            // 错误信息
            passwordError: '',
            usernameError: '',
            emailError: ''
        }
    },
    
    computed: {
        // 计算属性：所有字段是否都通过验证
        allFieldsValid() {
            return this.passwordValid && this.usernameValid && this.emailValid;
        }
    },
    
    methods: {
        // 密码验证方法
        validatePassword() {
            const passwordRegex = /^(?=.*[A-Z]{5})(?=.*[^A-Za-z0-9]{6})(?=.*-{2}).*$/;
            
            if (!this.password) {
                this.passwordError = '请输入密码';
                this.passwordValid = false;
                return;
            }
            
            if (!passwordRegex.test(this.password)) {
                this.passwordError = '密码必须包含5个大写字母、6个符号和2个连字符';
                this.passwordValid = false;
                return;
            }
            
            this.passwordError = '';
            this.passwordValid = true;
        },
        
        // 用户名验证方法
        validateUsername() {
            const usernameRegex = /^[a-zA-Z]+$/;
            
            if (!this.username) {
                this.usernameError = '请输入用户名';
                this.usernameValid = false;
                return;
            }
            
            if (!usernameRegex.test(this.username)) {
                this.usernameError = '用户名只能包含字母，不能包含空格或数字';
                this.usernameValid = false;
                return;
            }
            
            this.usernameError = '';
            this.usernameValid = true;
        },
        
        // 邮箱验证方法
        validateEmail() {
            const emailRegex = /^[^\s@]+@gmail\.com$/;
            
            if (!this.email) {
                this.emailError = '请输入邮箱地址';
                this.emailValid = false;
                return;
            }
            
            if (!emailRegex.test(this.email)) {
                this.emailError = '邮箱必须以@gmail.com结尾';
                this.emailValid = false;
                return;
            }
            
            this.emailError = '';
            this.emailValid = true;
        },
        
        // 表单提交验证
        validateForm() {
            this.validatePassword();
            this.validateUsername();
            this.validateEmail();
            
            if (this.allFieldsValid) {
                alert('所有验证通过！表单可以提交。');
                console.log('表单数据:', {
                    password: this.password,
                    username: this.username,
                    email: this.email
                });
            } else {
                alert('请检查并修正所有错误后再提交。');
            }
        }
    }
}).mount('#vueApp');
