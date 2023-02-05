import React, { useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import '../MainScreen.css'

function RoundToTwoDecimalPlaces(num : number) : number{
  return Number(Math.round(Number(num + "e+2")) + "e-2");
}

function calculateRepaymentValue(debt:number, montlyInterest:number, numberOfPayments:number) : number {
  return (debt / ((1-Math.pow(1+(montlyInterest), -numberOfPayments))/montlyInterest));
}

function calculateYearInterestPayments(debt:number, yearlyInterest:number, numberOfPayments:number) : {totalRepayment:number, totalInterestPayment: number} {
  var monthlyInterest = yearlyInterest/100/12
  var totalRepayment = 0
  var totalInterestPayment = 0
  for(let i = 0; i < 12; i++){
    var bankPayment = calculateRepaymentValue(debt, monthlyInterest, numberOfPayments)
    var interest = debt*monthlyInterest
    var repayment = bankPayment - interest
    totalRepayment += repayment
    totalInterestPayment += (bankPayment-repayment)
    debt -= repayment
    numberOfPayments--
  }

  return { totalRepayment, totalInterestPayment}
}

function MainScreen() {
  const [housePrice, setHousePrice] = React.useState("0");
  const [entryPayment, setEntryPayment] = React.useState("0");
  const [entryPaymentPercentage, setEntryPaymentPercentage] = React.useState("0");
  const [oneTimeCosts, setOneTimeCosts] = React.useState("0");
  const [monthlyCosts, setMonthlyCosts] = React.useState("0");
  const [condominiumCosts, setCondominiumCosts] = React.useState("0");
  const [monthlyBankPayment, setMonthlyBankPayment] = React.useState("0");
  const [monthlyBankRepayment, setMonthlyBankRepayment] = React.useState("0");
  const [imiCosts, setImiCosts] = React.useState("0");
  const [anualCosts, setAnualCosts] = React.useState("0");
  const [debt, setDebt] = React.useState("0");
  const [interest, setInterest] = React.useState("4.69");
  const [numberOfPayments, setNumberOfPayments] = React.useState("420");
  const [grossRent, setGrossRent] = React.useState("0");
  const [netRent, setNetRent] = React.useState("0");
  const [rentTax, setRentTax] = React.useState("40");
  const [taxCashBack, setTaxCashBack] = React.useState<Number>(0);
  const [firstYearRepayments, setFirstYearRepayments] = React.useState<Number>(0);
  const [anualCashFlow, setAnualCashFlow] = React.useState("0");
  const [monthlyCashFlow, setMonthlyCashFlow] = React.useState("0");
  const [monthlyCashFlowAmort, setMonthlyCashFlowAmort] = React.useState("0");
  const [initialCost, setInitialCost] = React.useState("0");
  const [roi, setRoi] = React.useState("0");
  const [repRoi, setRepRoi] = React.useState("0");
  

  const onAmountChange = (e:any, set: any) => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
      set(amount);
    }
  };

  const onAmountChange4 = (e:any, set: any) => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
      set(amount);
    }
  };

  const onEntryPaymentPercentageChange = (e:any) => {
    const amount = e.target.value;

    

    if (!amount || amount.match(/^\d{1,}(\.\d{0,4})?$/)) {
      if(Number(amount) > 100){
        setEntryPaymentPercentage("100")
        setEntryPayment(housePrice)
      }else{
        setEntryPaymentPercentage(amount);

        var housePriceNumber = Number(housePrice);
        var entryPaymentPercentageNumber = Number(amount)
        if(!Number.isNaN(housePriceNumber) && !Number.isNaN(entryPaymentPercentageNumber)){
          setEntryPayment((housePriceNumber*entryPaymentPercentageNumber/100).toString())
        }
      }
    }
  };

  useEffect(() => {
    var monthlyCostsNumber = Number(monthlyCosts);
    var monthlyBankPaymentNumber = Number(monthlyBankPayment);
    var anualCostsNumber = Number(anualCosts);
    var netRentNumber = Number(netRent);
    var imi = Number(imiCosts);
    var condominium = Number(condominiumCosts);

    if (Number.isNaN(imi)) { imi = 0 }
    if (Number.isNaN(condominium)) { condominium = 0 }


    if(!Number.isNaN(monthlyCostsNumber) &&
       !Number.isNaN(monthlyBankPaymentNumber) && 
       !Number.isNaN(anualCostsNumber) &&
       !Number.isNaN(netRentNumber)){
      var anualCashFlowNumber = netRentNumber*12 - ((monthlyCostsNumber+condominium+monthlyBankPaymentNumber)*12 + anualCostsNumber + imi);
      var monthlyCashFlowNumber = anualCashFlowNumber/12;
      setAnualCashFlow(RoundToTwoDecimalPlaces(anualCashFlowNumber).toString())
      setMonthlyCashFlow(RoundToTwoDecimalPlaces(monthlyCashFlowNumber).toString())

      let monthlyBankRepaymentNumber = Number(monthlyBankRepayment);
      if(Number.isNaN(monthlyBankRepayment)){
        monthlyBankRepaymentNumber = 0;
      }

      setMonthlyCashFlowAmort(RoundToTwoDecimalPlaces(monthlyCashFlowNumber + monthlyBankRepaymentNumber).toString())
    }
  },[monthlyCosts, monthlyBankPayment, anualCosts, netRent, imiCosts, condominiumCosts, monthlyBankRepayment])

  useEffect(() => {
    var entryPaymentNumber = Number(entryPayment);
    var oneTimeCostsNumber = Number(oneTimeCosts);

    if(!Number.isNaN(entryPaymentNumber) && !Number.isNaN(oneTimeCostsNumber)){
      var initialCostNumber = entryPaymentNumber + oneTimeCostsNumber;
      setInitialCost(RoundToTwoDecimalPlaces(initialCostNumber).toString())
    }
  },[entryPayment, oneTimeCosts])

  useEffect(() => {
    var anualCashFlowNumber = Number(anualCashFlow);
    var initialCostNumber = Number(initialCost);

    if(!Number.isNaN(anualCashFlowNumber) && !Number.isNaN(initialCostNumber)){
      var roiNumber = RoundToTwoDecimalPlaces(anualCashFlowNumber*100/initialCostNumber)
      setRoi(roiNumber.toString())
      var repRoiNumber = RoundToTwoDecimalPlaces((anualCashFlowNumber + RoundToTwoDecimalPlaces(Number(monthlyBankRepayment)*12)) *100/ initialCostNumber)
      setRepRoi(repRoiNumber.toString())
    }
  },[anualCashFlow, initialCost, monthlyBankRepayment])

  

  useEffect(() => {
    var housePriceNumber = Number(housePrice);
    var entryPaymentNumber = Number(entryPayment);

    if(!Number.isNaN(housePriceNumber) && !Number.isNaN(entryPaymentNumber)){
      var debtNumber = RoundToTwoDecimalPlaces(housePriceNumber-entryPaymentNumber);
      if(debtNumber < 0){
        debtNumber = 0;
      }
      setDebt(debtNumber.toString())
      setEntryPaymentPercentage((entryPaymentNumber*100/housePriceNumber).toString())
    }
  },[housePrice, entryPayment])

  useEffect(() => {
    var debtNumber = Number(debt);
    var interestNumber = Number(interest);
    var numberOfPaymentsNumber = Number(numberOfPayments);

    if(!Number.isNaN(debtNumber) && !Number.isNaN(interestNumber) && !Number.isNaN(numberOfPaymentsNumber)){
      var bankPayment = calculateRepaymentValue(debtNumber, interestNumber/100/12, numberOfPaymentsNumber)
      setMonthlyBankPayment(RoundToTwoDecimalPlaces(bankPayment).toString());
      setMonthlyBankRepayment(RoundToTwoDecimalPlaces(bankPayment - RoundToTwoDecimalPlaces(debtNumber*(interestNumber/100/12))).toString());
    }
  },[debt, interest, numberOfPayments])

  useEffect(() => {
    var debtNumber = Number(debt);
    var interestNumber = Number(interest);
    var numberOfPaymentsNumber = Number(numberOfPayments);
    var grossRentNumber  = Number(grossRent);

    if(!Number.isNaN(debtNumber) && debtNumber > 0){
    const totals = calculateYearInterestPayments(debtNumber, interestNumber, numberOfPaymentsNumber)
    setFirstYearRepayments(RoundToTwoDecimalPlaces(totals.totalRepayment))

      if(!Number.isNaN(grossRentNumber) && grossRentNumber > 0){
        setTaxCashBack(RoundToTwoDecimalPlaces(totals.totalInterestPayment*0.2))
      } else {
        setTaxCashBack(0);
      }
    }

  },[debt, interest, numberOfPayments, grossRent])

  useEffect(() => {
    var grossRentNumber = Number(grossRent);
    var rentTaxNumber = Number(rentTax);
    var imi = Number(imiCosts);
    var condominium = Number(condominiumCosts);
    var monthlyCostsNumber = Number(monthlyCosts);
    var anualCostsNumber = Number(anualCosts);
    if(!Number.isNaN(grossRentNumber) && !Number.isNaN(rentTaxNumber)){
      if (Number.isNaN(imi)) { imi = 0 }
      if (Number.isNaN(condominium)) { condominium = 0 }
      if (Number.isNaN(monthlyCostsNumber)) { monthlyCostsNumber = 0 }
      if (Number.isNaN(anualCostsNumber)) { anualCostsNumber = 0 }

      var taxes = 0
      var netRent = grossRentNumber
      if(rentTaxNumber > 0) {
        taxes = (((grossRentNumber-condominium-monthlyCostsNumber)*12)-anualCostsNumber)*(rentTaxNumber/100)
      }

      if (taxes > 0){
        netRent = grossRentNumber-(taxes/12)
      }

      setNetRent(RoundToTwoDecimalPlaces(netRent).toString())
    }
  },[grossRent, rentTax, imiCosts, condominiumCosts, anualCosts, monthlyCosts])

  const onEntryPaymentChange = (e:any) => {
    const amount = e.target.value;

    if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
      var val = Number(amount)
      var housePriceNumber = Number(housePrice);

      if (!Number.isNaN(housePriceNumber)){
        if (val > housePriceNumber){
          val = housePriceNumber
        }
      }

      setEntryPayment(val.toString());
      setEntryPaymentPercentage((val*100/housePriceNumber).toString())
    }
  };

  return (

      <>
        <h2 className='title'>Housing Cost & ROI Calculator</h2>

        <div className='roundedBox settings'>
          <form className='demoForm'>
            <div className='form-group'>

              <label htmlFor='housePrice'>Buy Price</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='housePrice'
                       value={housePrice}
                       onChange={e => onAmountChange(e, setHousePrice)}
                />
                <span className="input-group-text"> £ </span>
              </div>

              <div className="labelSpacing">
                <div className='side-by-side margin-right smallWidth'>
                  <label htmlFor='entryPayment labelSpacing'>Down payment</label>
                  <div className="input-group">
                    <input type='text'
                           className='form-control'
                           name='entryPayment'
                           value={entryPayment}
                           onChange={e => onEntryPaymentChange(e)}
                    />
                    <span className="input-group-text"> £ </span>
                  </div>
                </div>

                <div className='side-by-side smallWidth'>
                  <label htmlFor='entryPaymentPercentage labelSpacing'>Down payment percentage</label>
                  <div className="input-group">
                    <input type='text'
                           className='form-control'
                           name='entryPaymentPercentage'
                           value={entryPaymentPercentage}
                           onChange={e => onEntryPaymentPercentageChange(e)}
                    />
                    <span className="input-group-text"> % </span>
                  </div>
                </div>
              </div>

              <div className="labelSpacing">
              <label htmlFor='oneTimeCosts labelSpacing'>Buy costs (stamp duty/mortgage fees)</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='oneTimeCosts'
                       value={oneTimeCosts}
                       onChange={e => onAmountChange(e, setOneTimeCosts)}
                />
                <span className="input-group-text"> £ </span>
              </div>
              </div>

              <div className="labelSpacing">
              <label htmlFor='monthlyCosts labelSpacing'>Monthly Costs (Insurance)</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='monthlyCosts'
                       value={monthlyCosts}
                       onChange={e => onAmountChange(e, setMonthlyCosts)}
                />
                <span className="input-group-text"> £ </span>
              </div>
              </div>
              
              <div className="labelSpacing">
                  <label htmlFor='condominiumCosts'>Condominium Costs</label>
                  <div className="input-group">
                    <input type='text'
                           className='form-control'
                           name='condominiumCosts'
                           value={condominiumCosts}
                           onChange={e => onAmountChange(e, setCondominiumCosts)}
                    />
                    <span className="input-group-text"> £ </span>
                  </div>
                </div>

                <div className="labelSpacing">
                  <label htmlFor='imiCosts'>Council Taxes</label>
                  <div className="input-group">
                    <input type='text'
                           className='form-control'
                           name='imiCosts'
                           value={imiCosts}
                           onChange={e => onAmountChange(e, setImiCosts)}
                    />
                    <span className="input-group-text"> £ </span>
                  </div>
                </div>

              <div className="labelSpacing">
              <label htmlFor='anualCosts labelSpacing'>Anual Costs (Repairs/Ground rent)</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='anualCosts'
                       value={anualCosts}
                       onChange={e => onAmountChange(e, setAnualCosts)}
                />
                <span className="input-group-text"> £ </span>
              </div>
              </div>

            </div>
          </form>
        </div>
        <div className='roundedBox credit'>
          <form className='demoForm'>
            <div className='form-group'>
              <label htmlFor='debt'>Debt</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='debt'
                       value={debt}
                       disabled={true}
                       onChange={e => onAmountChange(e, setDebt)}
                />
                <span className="input-group-text"> £ </span>
              </div>

             <div className="labelSpacing">
             <label htmlFor='interest'>Interest rate</label>
             <div className="input-group">
               <input type='text'
                      className='form-control'
                      name='interest'
                      value={interest}
                      onChange={e => onAmountChange4(e, setInterest)}
               />
               <span className="input-group-text"> % </span>
             </div>
             </div>

              <div className="labelSpacing">
              <label htmlFor='numberOfPayments'>Number of payments</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='numberOfPayments'
                       value={numberOfPayments}
                       onChange={e => setNumberOfPayments(e.target.value)}
                />
                <span className="input-group-text"> # </span>
              </div>
              </div>

              <div className="labelSpacing">
              <label htmlFor='monthlyBankPayment'>Monthly mortgage payment</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='monthlyBankPayment'
                       value={monthlyBankPayment}
                       disabled={true}
                       onChange={e => setMonthlyBankPayment(e.target.value)}
                />
                <span className="input-group-text"> £ </span>
              </div>
              </div>

              <div className="labelSpacing">
                <label htmlFor='monthlyBankRepayment'>Monthly debt reduced</label>
                <div className="input-group">
                  <input type='text'
                         className='form-control'
                         name='monthlyBankRepayment'
                         value={monthlyBankRepayment}
                         disabled={true}
                         onChange={e => setMonthlyBankRepayment(e.target.value)}
                  />
                  <span className="input-group-text"> £ </span>
                </div>
              </div>


            </div>
          </form>
        </div>
        <div className='roundedBox rents'>
          <form className='demoForm'>
            <div className='form-group'>
              <label htmlFor='grossRent'>Monthly Rent</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='grossRent'
                       value={grossRent}
                       onChange={e => onAmountChange(e, setGrossRent)}
                />
                <span className="input-group-text"> £ </span>
              </div>

             <label htmlFor='interest'>Income tax</label>
             <div className="input-group">
               <input type='text'
                      className='form-control'
                      name='rentTax'
                      value={rentTax}
                      onChange={e => setRentTax(e.target.value)}
               />
               <span className="input-group-text"> % </span>
             </div>

              <label htmlFor='netRent'>Net Rent</label>
              <div className="input-group">
                <input type='text'
                       className='form-control'
                       name='netRent'
                       disabled={true}
                       value={netRent}
                       onChange={e => setNetRent(e.target.value)}
                />
                <span className="input-group-text"> £ </span>
              </div>
            </div>
          </form>
        </div>
        
        <div className='roundedBox cashFlow'>
        <OverlayTrigger
          overlay={<Tooltip id="button-tooltip">
          This value assumes the payment of the monthly expenses plus 1/12 of the yearly ones
          </Tooltip>}
            placement="top"
            delay={{ show: 250, hide: 300 }}
          >

          <div>
          <label htmlFor='monthlyCashFlow'>Monthly Cash Flow</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='monthlyCashFlow'
                   disabled={true}
                   value={monthlyCashFlow}
            />
            <span className="input-group-text"> £ </span>
          </div>
          </div>
          </OverlayTrigger>

          <OverlayTrigger
          overlay={<Tooltip id="button-tooltip">
          This value is an aproximation, because it always uses the debt reduced of the first month. In reality the debt reduced per month increases over time (sligthly)
          </Tooltip>}
            placement="top"
            delay={{ show: 250, hide: 300 }}
          >
          <div>
          <label htmlFor='monthlyCashFlowAmort'>Monthly Cash Flow + Monthly debt reduced</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='monthlyCashFlowAmort'
                   disabled={true}
                   value={monthlyCashFlowAmort}
            />
            <span className="input-group-text"> £ </span>
          </div>
          </div>
          </OverlayTrigger>

          <label htmlFor='anualCashFlow'>Anual Cash Flow</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='anualCashFlow'
                   disabled={true}
                   value={anualCashFlow}
            />
            <span className="input-group-text"> £ </span>
          </div>

          <label htmlFor='interestCashBack'>Interest cash back</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='interestCashBack'
                   disabled={true}
                   value={taxCashBack.toString()}
            />
            <span className="input-group-text"> £ </span>
          </div>

          <label htmlFor='interestCashBack'>Anual cash flow + cash back</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='interestCashBack'
                   disabled={true}
                   value={RoundToTwoDecimalPlaces(Number(anualCashFlow) + Number(taxCashBack)).toString()}
            />
            <span className="input-group-text"> £ </span>
          </div>

          <label htmlFor='interestCashBack'>Anual cash flow + cash back + repayment</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='interestCashBack'
                   disabled={true}
                   value={RoundToTwoDecimalPlaces(Number(anualCashFlow) + Number(taxCashBack) + Number(firstYearRepayments)).toString()}
            />
            <span className="input-group-text"> £ </span>
          </div>

          <label htmlFor='initialCost'>Total Inicial Investment</label>
          <div className="input-group">
          <input type='text'
                 className='form-control'
                 name='initialCost'
                 disabled={true}
                 value={initialCost}
          />
          <span className="input-group-text"> £ </span>
          </div>

          <label htmlFor='roi'>ROI</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='roi'
                   disabled={true}
                   value={roi}
            />
            <span className="input-group-text"> % </span>
          </div>

          <label htmlFor='repRoi'>ROI with debt reduction included</label>
          <div className="input-group">
            <input type='text'
                   className='form-control'
                   name='repRoi'
                   disabled={true}
                   value={repRoi}
            />
            <span className="input-group-text"> % </span>
          </div>
        </div>
      </>
  )
}

export default MainScreen