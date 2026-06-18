<template>
  <div class="traffic-bar">
    <div class="traffic-group">
      <h4>New Clients</h4>
      <p>2,642</p>
    </div>
    <div class="traffic-group">
      <h4>Recurring Clients</h4>
      <p>18,224</p>
    </div>
    <div class="traffic-group">
      <h4>Pageviews</h4>
      <p>49,123</p>
    </div>

    <div class="bars">
      <div class="bar-label">Male</div>
      <div class="bar">
        <div class="fill male" style="width: 52%">52%</div>
      </div>
      <div class="bar-label">Female</div>
      <div class="bar">
        <div class="fill female" style="width: 48%">48%</div>
      </div>

      <div class="bar-label">Google Search</div>
      <div class="bar">
        <div class="fill green" style="width: 61%">61%</div>
      </div>
      <div class="bar-label">Facebook</div>
      <div class="bar">
        <div class="fill blue" style="width: 27%">27%</div>
      </div>
      <div class="bar-label">Twitter</div>
      <div class="bar">
        <div class="fill twitter" style="width: 12%">12%</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.traffic-bar {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .traffic-group {
    display: inline-block;
    margin-right: 20px;

    h4 {
      margin: 0;
      color: #555;
    }

    p {
      font-weight: bold;
      font-size: 18px;
      margin: 4px 0 0;
    }
  }

  .bar-label {
    margin-top: 10px;
    font-size: 14px;
    color: #333;
  }

  .bar {
    background: #eee;
    height: 24px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 8px;

    .fill {
      height: 100%;
      text-align: right;
      padding-right: 8px;
      line-height: 24px;
      color: white;
      font-weight: 600;
    }

    .male {
      background: #42a5f5;
    }
    .female {
      background: #ec407a;
    }
    .green {
      background: #66bb6a;
    }
    .blue {
      background: #1e88e5;
    }
    .twitter {
      background: #00aced;
    }
  }
}
</style>