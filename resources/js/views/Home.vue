<template>
  <div>
    <!-- ДОХОДЫ -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Доходы</span>
          <span>50 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
          <span>Получено</span>
        </div>
      </div>
      <!-- тело -->
      <div class="cstm-body-card">
        <div v-for="o in 3" :key="o" class="cstm-point">
          <div class="cstm-head-point">Зарплата</div>
          <el-button type="primary" icon="el-icon-money" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-blue">99 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div v-for="o in 2" :key="o" class="cstm-point">
          <div class="cstm-head-point">Депозит</div>
          <el-button type="primary" icon="el-icon-coin" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-blue">99 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div class="cstm-point">
          <div class="cstm-head-point">Добавить</div>
          <el-button
            type="el-icon-search"
            icon="el-icon-plus"
            circle
            class="cstm-icon-point cstm-icon-point-add"
          ></el-button>
        </div>
      </div>
    </div>
    <!-- СЧЕТА -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Счета</span>
          <span type="text">550 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
          <span>В наличии</span>
        </div>
      </div>
      <!-- тело -->
      <div class="cstm-body-card">
        <div v-for="o in 2" :key="o" class="cstm-point">
          <div class="cstm-head-point">Карта</div>
          <el-button type="warning" icon="el-icon-bank-card" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-yellow">99 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div v-for="o in 3" :key="o" class="cstm-point">
          <div class="cstm-head-point">Наличные</div>
          <el-button type="warning" icon="el-icon-wallet" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-yellow">99 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div class="cstm-point">
          <div class="cstm-head-point">Добавить</div>
          <el-button
            type="el-icon-search"
            icon="el-icon-plus"
            circle
            class="cstm-icon-point cstm-icon-point-add"
          ></el-button>
        </div>
      </div>
    </div>
    <!-- Расходы -->
    <div class="cstm-box-card">
      <!-- хедер -->
      <div slot="header" class="cstm-header-card">
        <div class="clearfix cstm-up-text">
          <span>Расходы</span>
          <span>50 000,99 &#8381;</span>
          <span>10 000,99 &#8381;</span>
        </div>
        <div class="clearfix cstm-down-text">
          <span>Июль 2020</span>
          <span>В наличии</span>
          <span>В планах</span>
        </div>
      </div>
      <!-- тело -->
      <div class="cstm-body-card">
        <div v-for="o in 4" :key="o" class="cstm-point">
          <div class="cstm-head-point">Еда</div>
          <el-button type="success" icon="el-icon-tableware" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-green">9 000,99 &#8381;</div>
          <div class="cstm-money-point cstm-plan">9 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div v-for="o in 4" :key="o" class="cstm-point">
          <div class="cstm-head-point">Автомобиль</div>
          <el-button type="danger" icon="el-icon-truck" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-red">20 000,99 &#8381;</div>
          <div class="cstm-money-point cstm-plan">9 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div v-for="o in 5" :key="o" class="cstm-point">
          <div class="cstm-head-point">Прочее</div>
          <el-button type="info" icon="el-icon-present" circle class="cstm-icon-point"></el-button>
          <div class="cstm-money-point cstm-grey">0,00 &#8381;</div>
          <div class="cstm-plan">5 000,99 &#8381;</div>
          <i class="el-icon-edit cstm-edit"></i>
        </div>
        <div class="cstm-point">
          <div class="cstm-head-point">Добавить</div>
          <el-button
            type="el-icon-search"
            icon="el-icon-plus"
            circle
            class="cstm-icon-point cstm-icon-point-add"
          ></el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cstm-box-card {
  border-radius: 0%;
  border: none;
  margin-bottom: 30px;
}

.cstm-header-card {
  background-color: #5f6068;
  padding: 10px 30px;
}

.cstm-body-card {
  padding: 10px 0;
  display: flex;
  flex-wrap: wrap;
  background-color: #3d3e48;
}

.cstm-up-text {
  text-transform: uppercase;
  font-size: 20px;
  color: #ffffff;
  display: flex;
  justify-content: space-between;
}

.cstm-down-text {
  text-transform: lowercase;
  font-size: 12px;
  color: #9a9898;
  display: flex;
  justify-content: space-between;
}

.cstm-right-text {
  float: right;
  padding: 3px 0;
}

.cstm-icon-point {
  font-size: 50px;
  position: relative;
  left: 50%;
  transform: translate(-50%, 0);
}

.cstm-icon-point-add {
  background-color: #3d3e48;
  color: #ffffff;
}

.cstm-head-point {
  color: #ffffff;
  text-align: center;
  padding-bottom: 4px;
  font-weight: 300;
}

.cstm-money-point {
  text-align: center;
  padding-top: 4px;
  font-weight: 500;
}

.cstm-plan {
  text-align: center;
  margin-top: -7px;
  font-size: 11px;
  color: #9a9898;
  font-weight: 200;
}

.cstm-point {
  margin-bottom: 10px;
  width: 16.66%;
  position: relative;
}

.cstm-point:hover .cstm-edit {
  display: block;
  cursor: pointer;
}

.cstm-edit {
  color: #9a9898;
  position: absolute;
  top: 25px;
  right: 35px;
  font-size: 15px;
  display: none;
  transition: 0.3s;
}

.cstm-edit:hover {
  color: #67c23a;
}

.cstm-blue {
  color: #0a93d1;
}
.cstm-yellow {
  color: #e6a23c;
}

.cstm-green {
  color: #67c23a;
}

.cstm-red {
  color: #f56c6c;
}

.cstm-grey {
  color: #909399;
}
</style>
