from pydantic import BaseModel

class FraudTipBase(BaseModel):
    platform: str
    message: str

class FraudTipCreate(FraudTipBase):
    pass

class FraudTipOut(FraudTipBase):
    id: int
    flagged: bool

    class Config:
        orm_mode = True
