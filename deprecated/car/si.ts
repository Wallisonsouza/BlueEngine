
// class CarSimulation extends Scrypt {
//     private car?: GameObject;
//     private wheel_FL?: GameObject;
//     private wheel_FR?: GameObject;
//     private wheel_RL?: GameObject;
//     private wheel_RR?: GameObject;
  
//     public start(): void {

      
//         this.car = SceneManager.getGameObjectByName("car");
//         this.wheel_FL = SceneManager.getGameObjectByName("wheel_FL");
//         this.wheel_FR = SceneManager.getGameObjectByName("wheel_FR");
//         this.wheel_RR = SceneManager.getGameObjectByName("wheel_RR");
//         this.wheel_RL = SceneManager.getGameObjectByName("wheel_RL");
//         this.ray = SceneManager.getGameObjectByName("ray");


//         if (!this.car || !this.wheel_FL || !this.wheel_FR || !this.wheel_RL || !this.wheel_RR) {
//             console.error("Erro: Objetos do carro ou rodas não foram encontrados.");
//             return;
//         }

//         const boxCollider = this.car.addComponent(BoxCollider);
//         boxCollider.size = new Vector3(4.2, 5, 13);
//         boxCollider.center = new Vector3(0, 0, 0);

//         this.car.addComponent(RigidBody);

//         const plane = GameObjectBuilder.createPlane();
//         SceneManager.addGameObject(plane)


//         // const cube = GameObjectBuilder.createCube();
//         // cube.transform.position = new Vector3(0, 0 , 10);
//         // cube.transform.scale = new Vector3(100, 100, 1);

//         // SceneManager.addGameObject(cube)

//         // for(let i = 0; i < 100; i++) {
//         //     const cube = GameObjectBuilder.createCube();
//         //     cube.transform.position = Vector3.random(-100, 100);
//         //     SceneManager.addGameObject(cube)
//         // }

//     }

//     private verticalInterpolation = 0.0;
//     public update(): void {

//         const accelerationRate = 2.0; 
//         const brakeRate = 4.0;  
//         const maxSpeed = 8.0; 
        
//         if (Input.getKey(KeyCode.Up)) {
//             // Acelera gradualmente
//             this.verticalInterpolation = Mathf.lerp(this.verticalInterpolation, maxSpeed, Time.deltaTime * accelerationRate);
//         } else if (Input.getKey(KeyCode.Down)) {
//             // Desacelera na direção negativa (para trás)
//             this.verticalInterpolation = Mathf.lerp(this.verticalInterpolation, -maxSpeed, Time.deltaTime * accelerationRate);
//         } else {
//             // Caso nenhuma tecla de direção seja pressionada, aplica desaceleração
//             this.verticalInterpolation = Mathf.lerp(this.verticalInterpolation, 0.0, Time.deltaTime * brakeRate);
//         }
        
//         // Adicionando efeito de freio quando a tecla de espaço é pressionada
//         if (Input.getKey(KeyCode.Space)) {
//             // Se a velocidade não for zero, desacelera gradualmente
//             if (Mathf.abs(this.verticalInterpolation) > 0) {
//                 const brakeDirection = Mathf.sign(this.verticalInterpolation);  // Direção do movimento (para frente ou para trás)
//                 this.verticalInterpolation -= brakeRate * brakeDirection * Time.deltaTime;  // Aplica o freio
//             }
//         }
       
//         const linearVelocity = this.verticalInterpolation * Time.deltaTime;

//         this.car?.transform.translate(Vector3.FORWARD.scale(-linearVelocity), Space.SELF);

//         const angularVelocity = Mathf.linearToAngular(linearVelocity, 1.0);
//         this.wheel_FL?.transform.rotate(Vector3.LEFT, Mathf.radToDeg(angularVelocity));
//         this.wheel_RL?.transform.rotate(Vector3.LEFT, Mathf.radToDeg(angularVelocity));

//         this.wheel_FR?.transform.rotate(Vector3.LEFT, Mathf.radToDeg(angularVelocity));
//         this.wheel_RR?.transform.rotate(Vector3.LEFT, Mathf.radToDeg(angularVelocity));
         
//     }
// }

// if (this.car) {

//     const wheelRadius = 1.0; // Raio da roda (ajuste conforme necessário)

//     // Calculando a direção do carro
//     if (Input.getKey(KeyCode.Down)) {
//         this.direction = this.car.transform.forward;
//         this.currentSpeed += this.acceleration * Time.deltaTime;
//     } else if (Input.getKey(KeyCode.Up)) {
//         this.direction = this.car.transform.forward;
//         this.currentSpeed -= this.acceleration * Time.deltaTime;
//     } else {
//         if (this.currentSpeed > 0) {
//             this.currentSpeed -= this.deceleration * Time.deltaTime * Mathf.sqrt(Mathf.abs(this.currentSpeed));
//         } else if (this.currentSpeed < 0) {
//             this.currentSpeed += this.deceleration * Time.deltaTime * Mathf.sqrt(Mathf.abs(this.currentSpeed));
//         }
//     }

//     this.currentSpeed = Mathf.clamp(this.currentSpeed, -this.maxSpeed, this.maxSpeed);
//     this.direction = this.direction.normalize();

//     // Atualiza a posição do carro
//     const movement = this.direction.scale(this.currentSpeed * Time.deltaTime);
//     const newPos = this.car.transform.position.add(movement);
//     this.car.transform.position = newPos;

//     console.log(`Current Speed: ${this.currentSpeed.toFixed(2)} m/s`);

//     // Rotação do carro
//     if (Mathf.abs(this.currentSpeed) > 1.0) { // Apenas gira se a velocidade for maior que 1.0
//         const rotationFactor = Mathf.clamp(this.currentSpeed / this.maxSpeed, 0.5, 1.0); // Escala de rotação
//         if (Input.getKey(KeyCode.Left)) {
//             this.car.transform.rotate(Vector3.up, Mathf.radToDeg(rotationFactor) * Time.deltaTime);
//         }
//         if (Input.getKey(KeyCode.Right)) {
//             this.car.transform.rotate(Vector3.up, -Mathf.radToDeg(rotationFactor) * Time.deltaTime);
//         }
//     }

//     const distante = Vector3.distance(this.car.transform.position, this.lastPosition);
//     const linearVelocity = distante / Time.deltaTime;

//     this.lastPosition = this.car.transform.position;

//     // Calcula a velocidade angular das rodas
//     const angularVelocity = (linearVelocity / wheelRadius); // Velocidade angular das rodas (em rad/s)

//     if (Mathf.abs(linearVelocity) > 0) {
        
//         this.angle.x += angularVelocity * Mathf.sign(this.currentSpeed);
        
//     }

        
//     if (Input.getKey(KeyCode.Left)) {
//         this.angle.y += linearVelocity;
//     } else if (Input.getKey(KeyCode.Right)) {
//         this.angle.y -= linearVelocity;
//     } else {
//         const rotationSpeed = 4.0; 
//         if (Mathf.abs(this.angle.y) > 0.1) { 
//             this.angle.y = Mathf.lerp(this.angle.y, 0, rotationSpeed * Time.deltaTime);
//         } else {
//             this.angle.y = 0;
//         }
//     }

//     this.angle.y = Mathf.clamp(this.angle.y, -45, 45);
//     this.angle.z = Mathf.clamp(this.angle.z, -45, 45);

//     // Aplica a rotação no carro
//     if (this.wheel_FL && this.wheel_FR && this.wheel_RL && this.wheel_RR) {
//         this.wheel_FL.transform.rotation = Quaternion.fromEulerAngles(this.angle);
//         this.wheel_FR.transform.rotation = Quaternion.fromEulerAngles(this.angle);
//         this.wheel_RL.transform.rotation = Quaternion.fromEulerAngles(new Vector3(this.angle.x));
//         this.wheel_RR.transform.rotation = Quaternion.fromEulerAngles(new Vector3(this.angle.x));
//     }
    
// }