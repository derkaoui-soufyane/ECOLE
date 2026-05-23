<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class sujjets_filieres extends Model
{
     protected $fillable = [
        'filiere_id',
        'sujjet_id' // ⚠️ صححها إذا كانت sujjet_id
    ];

    public function filiere()
    {
        return $this->belongsTo(filieres::class, 'filiere_id');
    }

    public function sujet()
    {
        return $this->belongsTo(sujjet::class, 'sujjet_id');
    }
}
